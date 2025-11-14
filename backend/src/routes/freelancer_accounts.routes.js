import express from 'express';
import {verifyJWT} from '../middlewares/auth.middlewares.js';
import {roleAuth} from '../middlewares/roleAuth.middleware.js';
import {addFreelancerAccount} from '../controllers/freelancerAccount.controller.js'

const accountRoutes = express.Router();

accountRoutes.route('/setup').post(verifyJWT, roleAuth('freelancer'), addFreelancerAccount);

export default route;