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
import userRoutes from './routes/user.routes.js';

// User Routes
app.use('/api/v1/users', userRoutes);

export default app;