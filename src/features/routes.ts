import { Router } from 'express';
import { chatController } from './chat/chatController';

const apiController = Router();
apiController.use('/chats', chatController);

export { apiController }; 
