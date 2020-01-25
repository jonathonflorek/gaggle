import { Router } from 'express';
import { validate } from 'validate-typescript';
import { getManager } from 'typeorm';
import { chatRequestSchema, handleChatMatchOrCreate } from './matchOrCreate';

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

export { chatController };
