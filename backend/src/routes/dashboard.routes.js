import express from 'express';
import {verifyJWT} from '../middlewares/auth.middlewares.js';
import {roleAuth} from '../middlewares/roleAuth.middleware.js';
import {clientDashboard, freelancerDashboard, adminDashboard} from '../controllers/dashboard.controllers.js';

const dashboardRouter = express.Router();

dashboardRouter.route('/client/:clientId').get(verifyJWT, clientDashboard);
dashboardRouter.route('/freelancer/:freelancerId').get(verifyJWT, freelancerDashboard);
dashboardRouter.route('/admin/:adminId').get(verifyJWT, adminDashboard);


export default dashboardRouter;