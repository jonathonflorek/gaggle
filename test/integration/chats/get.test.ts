import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { getRepository } from 'typeorm';
import { app } from '../../../src';
import { OK } from 'http-status-codes'
import { ChatEntity } from '../../../src/models/ChatEntity';
import { ChatMessageEntity } from '../../../src/models/ChatMessageEntity';

chai.use(chaiHttp);
const { expect } = chai;

describe('Endpoint test for chats: GET /chats', () => {
    const CHAT_ENDPOINT = '/api/chats';

    it('GIVEN a chat with messages, ' +
        'WHEN getting the chat, ' +
        'THEN a response with HTTP STATUS OK and the result',
        async () => {

            // Arrange

            const chat = new ChatEntity();
            chat.location = {
                type: 'Point',
                coordinates: [-104.594425, 50.441146],
            };
            chat.name = 'getname';
            chat.maxSize = 6;
            chat.size = 1;
            chat.tagList = ['gettag'];
            chat.messages = [
                {
                    id: 0,
                    message: 'A message',
                    username: 'User 123',
                    timestamp: new Date('2020-01-25T19:05:41.669Z'),
                    chat,
                },
                {
                    id: 2,
                    message: 'Another message',
                    username: 'User 456',
                    timestamp: new Date('2020-01-25T19:05:45.669Z'),
                    chat,
                },
                {
                    id: 3,
                    message: 'A third message',
                    username: 'User 123',
                    timestamp: new Date('2020-01-25T19:06:20.669Z'),
                    chat,
                },
            ];

            await getRepository(ChatEntity).save(chat);
            for (const message of chat.messages) {
                await getRepository(ChatMessageEntity).save(message);
            }

            // Act

            const result = await chai
                .request(app)
                .get(CHAT_ENDPOINT + '/' + chat.id.toString())
                .send();

            // Assert

            expect(result).to.have.status(OK);
            expect(result.body).to.deep.equal({
                chatId: chat.id.toString(),
                chatName: 'getname',
                messages: [
                    {
                        username: 'User 123',
                        message: 'A third message',
                        timestamp: '2020-01-25T19:06:20.669Z',
                    },
                    {
                        username: 'User 456',
                        message: 'Another message',
                        timestamp: '2020-01-25T19:05:45.669Z',
                    },
                    {
                        username: 'User 123',
                        message: 'A message',
                        timestamp: '2020-01-25T19:05:41.669Z',
                    },
                ]
            })

        });
})
