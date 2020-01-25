import { Socket } from 'socket.io';
import { ChatMessageEntity } from './models/ChatMessageEntity';
import { getRepository } from 'typeorm';

export function onConnection(socket: Socket) {
    let _chatId: string = '';
    socket.on('join-chat', (chatId: string) => {
        _chatId = chatId;
        socket.join(chatId);
    });
    socket.on('message', async (username: string, message: string) => {
        const saved = await getRepository(ChatMessageEntity).save({
            username,
            message,
            timestamp: new Date(),
            chat: {
                id: Number(_chatId),
            },
        });
        socket.broadcast.to(_chatId).emit('message', username, message, saved.timestamp);
    });
}
