import express from 'express';
import { verifyJWT } from '../middlewares/auth.middlewares.js';
import {roleAuth} from '../middlewares/roleAuth.middleware.js';
import { createProject } from '../controllers/project.controllers.js';
const projectRoutes = express.Router();


projectRoutes.route('/create').post(verifyJWT, roleAuth('Client'), createProject)


export default projectRoutes;