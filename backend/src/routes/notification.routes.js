import express from 'express';
import {verifyJWT} from '../middlewares/auth.middlewares.js';
import {getnotification, markAsRead, markAllAsRead} from '../controllers/notification.controllers.js';

const notificationRoutes = express.Router();

notificationRoutes.route('/').get(verifyJWT, getnotification);
notificationRoutes.route('/read/:userId').post(verifyJWT, markAsRead);
notificationRoutes.route('/read-all').post(verifyJWT, markAllAsRead);

export default notificationRoutes;

