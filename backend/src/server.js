import express from 'express';
import dotenv from 'dotenv';
import app from './app.js';
import { connectionDb } from './config/db.config.js';
dotenv.config();

const PORT = process.env.PORT || 5000;

connectionDb()
.then(() => {
  app.on('error', (err) => {
    console.error('Server error:', err);
    throw err;
  });
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
).catch((err) => {
  console.error('Database connection failed:', err);
});
