import { resultFactory } from "../../util";
import { EntityManager } from "typeorm";
import { Primitive } from "validate-typescript";
import { ChatEntity } from "../../models/ChatEntity";
import { ChatMessageEntity } from "../../models/ChatMessageEntity";

export const chatGetSchema = {
    id: Primitive(String),
};

interface ChatGetResults {
    success: {
        chatId: string;
        chatName: string;
        messages: {
            username: string;
            message: string;
            timestamp: Date;
        }[];
    };
    notFound: null;
}

const result = resultFactory<ChatGetResults>();

export async function handleGet(
    manager: EntityManager,
    request: typeof chatGetSchema,
) {
    const { id } = request;

    const chat = await manager
        .getRepository(ChatEntity)
        .findOne({ id: Number(id) });
    
    if (!chat) {
        return result('notFound', null);
    }

    const messageHistory = await manager
        .getRepository(ChatMessageEntity)
        .find({ 
            where: { chat },
            order: { timestamp: 'DESC' },
        });
    
    return result('success', {
        chatId: chat.id.toString(),
        chatName: chat.name,
        messages: messageHistory.map(message => ({
            username: message.username,
            timestamp: message.timestamp,
            message: message.message,
        })),
    });
}
