import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { getRepository } from 'typeorm';
import { app } from '../../../src';
import { OK } from 'http-status-codes'
import { ChatEntity } from '../../../src/models/ChatEntity';

chai.use(chaiHttp);
const { expect } = chai;

describe('Endpoint test for chats: POST /chats', () => {
    const CHAT_ENDPOINT = '/api/chats';

    it('GIVEN no chats, ' +
        'WHEN posting to chats endpoint, ' +
        'THEN a response with HTTP STATUS OK and created chat',
        async () => {

            // Arrange

            const chatRequest = {
                location: {
                    type: 'Point',
                    coordinates: [-104.594918, 50.441050],
                },
                name: 'abc chat',
                size: 6,
                tags: ['tag'],
            };

            // Act

            const result = await chai
                .request(app)
                .post(CHAT_ENDPOINT)
                .send(chatRequest);

            const chatsInDB = await getRepository(ChatEntity).find();
            console.log(result.body);

            // Assert

            expect(result).to.have.status(OK);
            expect(chatsInDB.length).to.equal(1);
            expect(result.body).to.deep.equal({
                chatId: chatsInDB[0].id.toString(),
                chatName: 'abc chat'
            });
            expect(chatsInDB[0]).to.deep.include({
                name: 'abc chat',
                maxSize: 6,
                size: 1,
                tagList: ['tag'],
            });
            expect(chatsInDB[0].location?.type).to.equal('Point');
        });
        
    it('GIVEN a faraway chat, ' +
        'WHEN posting to chats endpoint, ' +
        'THEN a response with HTTP STATUS OK and created chat',
        async () => {
            // Arrange

            const farawayChat = new ChatEntity();
            farawayChat.location = {
                type: 'Point',
                coordinates: [-104.558376, 50.437538],
            };
            farawayChat.name = 'name';
            farawayChat.maxSize = 6;
            farawayChat.size = 1;
            farawayChat.tagList = ['tag'];
            farawayChat.messages = [];
            const saved = await getRepository(ChatEntity).save(farawayChat);

            const chatRequest = {
                location: {
                    type: 'Point',
                    coordinates: [-104.594918, 50.441050],
                },
                name: 'abc chat',
                size: 6,
                tags: ['tag'],
            };

            // Act

            const result = await chai
                .request(app)
                .post(CHAT_ENDPOINT)
                .send(chatRequest);

            const chatsInDB = await getRepository(ChatEntity).find();
            const newChats = chatsInDB.filter(x => x.id !== saved.id);

            // Assert

            expect(result).to.have.status(OK);
            expect(newChats.length).to.equal(1);
            expect(result.body).to.deep.equal({
                chatId: newChats[0].id.toString(),
                chatName: 'abc chat'
            });
        });
    
    it('GIVEN a nearby chat, ' +
        'WHEN posting to chats endpoint, ' +
        'THEN a response with HTTP STATUS OK and joining existing',
        async () => {
            // Arrange

            const nearbyChat = new ChatEntity();
            nearbyChat.location = {
                type: 'Point',
                coordinates: [-104.594425, 50.441146],
            };
            nearbyChat.name = 'name';
            nearbyChat.maxSize = 6;
            nearbyChat.size = 1;
            nearbyChat.tagList = ['tag'];
            nearbyChat.messages = [];
            const saved = await getRepository(ChatEntity).save(nearbyChat);

            const chatRequest = {
                location: {
                    type: 'Point',
                    coordinates: [-104.594918, 50.441050],
                },
                name: 'abc chat',
                size: 6,
                tags: ['tag'],
            };

            // Act

            const result = await chai
                .request(app)
                .post(CHAT_ENDPOINT)
                .send(chatRequest);

            const chatsInDB = await getRepository(ChatEntity).find();

            // Assert

            expect(result).to.have.status(OK);
            expect(chatsInDB.length).to.equal(1);
            expect(result.body).to.deep.equal({
                chatId: saved.id.toString(),
                chatName: 'name',
            });
        });
});
