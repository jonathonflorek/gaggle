import * as io from 'socket.io-client';
import { expect } from 'chai';
import { getRepository } from 'typeorm';
import { ChatEntity } from '../../src/models/ChatEntity';
import { ChatMessageEntity } from '../../src/models/ChatMessageEntity';
import { appPort } from '../../src/config';

const socketUrl = `http://localhost:${appPort}`;
const options = {
    transports: ['websocket'],
    forceNew: true,
};

describe('sockets', () => {
    it('should be able to broadcast messages', async () => {

        // Arrange

        const chat = await getRepository(ChatEntity).save({
            location: {
                type: 'Point',
                coordinates: [-104.594425, 50.441146],
            },
            name: 'socketname',
            maxSize: 6,
            size: 2,
            tagList: ['socket'],
        });

        const client1 = io.connect(socketUrl, options);
        await new Promise(resolve => client1.on('connect', resolve));
        client1.emit('join-chat', chat.id.toString());
        
        const client2 = io.connect(socketUrl, options);
        await new Promise(resolve => client2.on('connect', resolve));
        client2.emit('join-chat', chat.id.toString());

        // Act

        client1.send('username', 'hello world');
        client1.send('username', 'hello world 2');

        const received = await new Promise<any[]>(resolve => {
            const response: any[] = [];
            client2.on('message', (...args: any[]) => {
                response.push(args);
                if (response.length === 2) {
                    resolve(response);
                }
            });
        });

        const saved = await getRepository(ChatMessageEntity).find({
            order: { timestamp: 'ASC' },
        });

        // Assert

        expect(received.length).to.equal(2);
        expect(received[0][1]).to.equal('hello world');
        expect(received[1][1]).to.equal('hello world 2');
        expect(saved.length).to.equal(2);
        expect(saved[0]).to.deep.include({
            username: 'username',
            message: 'hello world',
        });
        expect(saved[1]).to.deep.include({
            username: 'username',
            message: 'hello world 2',
        });

        // Teardown

        client1.disconnect();
        client2.disconnect();
    });
});
