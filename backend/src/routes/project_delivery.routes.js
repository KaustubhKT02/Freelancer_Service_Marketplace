import express from 'express';
import {verifyJWT} from '../middlewares/auth.middlewares.js';
import {roleAuth} from '../middlewares/roleAuth.middleware.js';
import {upload} from '../middlewares/multer.middlewares.js';
import {accepteDelivery, deliveryProject} from '../controllers/projectDelivery.controller.js';


const deliveryRoutes = express.Router();


deliveryRoutes.route('/deliver/:projectId').post(verifyJWT, roleAuth('freelancer'), upload.single('file_url'), deliveryProject);
deliveryRoutes.route('/accept/:projectId').post(verifyJWT, roleAuth('client'), accepteDelivery);


export default deliveryRoutes;

