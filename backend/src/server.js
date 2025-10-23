import express from 'express';
import dotenv from 'dotenv';
import { connectionDb } from './config/db.config';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;


connectionDb();

app.get('/', (req, res) => {
    res.send('Freelancer Service Marketplace Backend is running.');
});

app.listen(PORT, () => {
  console.log('server is running on port', PORT);
})