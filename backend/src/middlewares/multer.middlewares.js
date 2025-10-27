import multer from 'multer';
import users from '../models/users.models.js';

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp')
  },

  filename: function (req, file, cb) {
    const name = req.body.username + '-' + Date.now();
    cb(null, file.name)
  }
})

export const upload = multer({ 
     storage, 
     limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});