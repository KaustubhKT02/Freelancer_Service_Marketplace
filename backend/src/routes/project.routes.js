import express from 'express';
import { verifyJWT } from '../middlewares/auth.middlewares.js';
import {roleAuth} from '../middlewares/roleAuth.middleware.js';
import { createProject, deleteProject, getProject, getProjectById, updateProject } from '../controllers/project.controllers.js';
const projectRoutes = express.Router();


// Public Route
projectRoutes.route('/').get(getProject);
projectRoutes.route('/:id').get(getProjectById);

// Secure route
projectRoutes.route('/').post(verifyJWT, roleAuth('Client'), createProject);
projectRoutes.route('/update/:id').put(verifyJWT, roleAuth('Client'), updateProject);
projectRoutes.route('/delete/:id').delete(verifyJWT, roleAuth('Client'), deleteProject)


export default projectRoutes;