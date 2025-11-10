import express from 'express';
import {sendMessage, markMessageRead, getMessage} from '../controllers/message.controllers.js';
import { verifyJWT } from '../middlewares/auth.middlewares.js';
import { upload } from '../middlewares/multer.middlewares.js';

const messageRoute = express.Router();

messageRoute.route('/send').post(verifyJWT, upload.single('attachment'), sendMessage);
messageRoute.route('/read/:userId').put(verifyJWT, markMessageRead);
messageRoute.route('/list').get(verifyJWT, getMessage);

export default messageRoute