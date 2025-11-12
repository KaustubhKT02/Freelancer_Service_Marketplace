import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";



const app = express();


// Middleware
app.use(cors(
    {
        origin: 'process.env.CORS_URL',
        credentials: true
    }
));
app.use(express.json(
    {
        limit: '50mb'
    }
));
app.use(express.urlencoded({extends: true, limit: '50mb'}));
app.use(express.static('public'))
app.use(cookieParser());

// Routes
import {userRoutes, projectRoutes, proposalRoutes, messageRoute, paymentRoutes} from './routes/routes.js';
// User Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/proposals', proposalRoutes);
app.use('/api/v1/messages', messageRoute);
app.use('/api/v1/payments', paymentRoutes);

export default app;