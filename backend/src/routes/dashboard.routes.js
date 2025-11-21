import express from 'express';
import {verifyJWT} from '../middlewares/auth.middlewares.js';
import {clientDashboard, freelancerDashboard, adminDashboard} from '../controllers/dashboard.controllers.js';

const dashboardRouter = express.Router();

dashboardRouter.route('/client').get(verifyJWT, clientDashboard);
dashboardRouter.route('/freelancer').get(verifyJWT, freelancerDashboard);
dashboardRouter.route('/admin').get(verifyJWT, adminDashboard);


export default dashboardRouter;