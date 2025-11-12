import express from 'express';
import { verifyJWT } from '../middlewares/auth.middlewares.js';
import { roleAuth } from '../middlewares/roleAuth.middleware.js';
import {createOrder} from '../controllers/payment.conttrollers.js'

const paymentRoutes = express.Router();

paymentRoutes.route('/order/:projectId').post(verifyJWT, roleAuth('client'), createOrder);



export default paymentRoutes;