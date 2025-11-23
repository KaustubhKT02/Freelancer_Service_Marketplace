import http from 'http';
import dotenv from 'dotenv';
import app from './app.js';
import { connectionDb } from './config/db.config.js';
import {initSocket} from './config/socket.config.js';
import {initNotificationSocket} from './utils/notification.utils.js'

dotenv.config();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app)

connectionDb()
.then(() => {
  app.on('error', (err) => {
    console.error('Server error:', err);
    throw err;
  });
  
  // server config
  initSocket(server);
  initNotificationSocket(initSocket.io);

  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
).catch((err) => {
  console.error('Database connection failed:', err);
});
