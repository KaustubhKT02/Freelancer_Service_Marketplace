import express from "express";
import { connectionDb } from "./config/db.config.js";


const app = express();

// Establish database connection
connectionDb();


export default app;