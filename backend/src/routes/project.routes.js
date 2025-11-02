import express from 'express';
import { verifyJWT } from '../middlewares/auth.middlewares.js';
import {roleAuth} from '../middlewares/roleAuth.middleware.js';
import { createProject, getProject, getProjectById } from '../controllers/project.controllers.js';
const projectRoutes = express.Router();


// Public Route
projectRoutes.route('/').get(getProject);
projectRoutes.route('/:id').get(getProjectById)

// Secure route
projectRoutes.route('/').post(verifyJWT, roleAuth('Client'), createProject)



export default projectRoutes;