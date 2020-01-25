import { Router } from 'express';
import { validate } from 'validate-typescript';
import { getManager } from 'typeorm';
import { chatRequestSchema, handleChatMatchOrCreate } from './matchOrCreate';
import { chatGetSchema, handleGet } from './get';

const chatController = Router();

chatController.post('/', async (req, res, next) => {
    try {
        const chatRequest = validate(chatRequestSchema, req.body);
        const result = await handleChatMatchOrCreate(
            getManager(),
            chatRequest,
        );
        switch(result.type) {
            case 'success':
                res.status(200).json(result.payload);
                break;
        }
    } catch (ex) {
        next(ex);
    }
});

chatController.get('/:id', async (req, res, next) => {
    try {
        const getRequest = validate(chatGetSchema, req.params);
        const result = await handleGet(getManager(), getRequest);
        switch(result.type) {
            case 'success':
                res.status(200).json(result.payload);
                break;
            case 'notFound':
                res.status(404).send();
                break;
        }
    } catch (ex) {
        next(ex);
    }
})

export { chatController };
