import { Primitive } from 'validate-typescript';
import { resultFactory } from '../../util';
import { EntityManager, Brackets } from 'typeorm';
import { ChatEntity } from '../../models/ChatEntity';

const geoJsonPointSchema = {
    type: 'Point' as const,
    coordinates: [Primitive(Number)], // lon, lat
};

export const chatRequestSchema = {
    location: geoJsonPointSchema,
    name: Primitive(String),
    size: Primitive(Number),
    tags: [Primitive(String)],
};

interface ChatMatchResults {
    success: {
        chatId: string;
        chatName: string;
    };
}

const result = resultFactory<ChatMatchResults>();

export async function handleChatMatchOrCreate(
    manager: EntityManager,
    chatRequest: typeof chatRequestSchema,
) {
    const { size, tags, location, name } = chatRequest;

    const repo = manager.getRepository(ChatEntity);

    const existingChatQb = repo.createQueryBuilder('chat')
        .where('chat.maxSize > chat.size');
    
    existingChatQb.andWhere('chat.maxSize = :size', { size });

    existingChatQb.andWhere(new Brackets(qb => {
        qb.where('1 = 1');
        tags.forEach(tag => {
            qb.orWhere('chat.tagList LIKE :tag', { tag: `%${tag}%` });
        })
    }));

    const { lng, lat } = extractLatLon(location);

    // distance query based on https://postgis.net/docs/ST_Distance.html
    existingChatQb.andWhere(`
        ST_DWithin(
            chat.location::geography,
            ST_GeomFromText('POINT(${lng} ${lat})',4326)::geography,
            100)
    `);

    existingChatQb.limit(20);

    const matches = await existingChatQb.getMany();

    if (matches.length) {
        // just pick the first chat for now
        const chat = matches[0];

        chat.size += 1;
        repo.save(chat);

        return result('success', {
            chatId: chat.id.toString(),
            chatName: chat.name,
        });
    }

    // no match found - create a new chat
    const newChat = new ChatEntity();
    newChat.location = location;
    newChat.tagList = tags;
    newChat.maxSize = size;
    newChat.size = 1;
    newChat.name = name;
    newChat.messages = [];
    const chatSaved = await repo.save(newChat);
    return result('success', {
        chatId: chatSaved.id.toString(),
        chatName: name,
    });
}



function extractLatLon(point: typeof geoJsonPointSchema) {
    const [lng, lat] = point.coordinates;
    return { lng, lat };
}
