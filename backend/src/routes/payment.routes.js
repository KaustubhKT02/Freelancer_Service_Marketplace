import express from 'express';
import { verifyJWT } from '../middlewares/auth.middlewares.js';
import { roleAuth } from '../middlewares/roleAuth.middleware.js';
import {genrateUPIPaymentLink} from '../controllers/payment.conttrollers.js'

const paymentRoutes = express.Router();

paymentRoutes.route('/direct/:projectId').get(verifyJWT, roleAuth('client'), genrateUPIPaymentLink)



export default paymentRoutes;