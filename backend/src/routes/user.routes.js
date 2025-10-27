import express from 'express';
import { registerUser } from '../controllers/user.controllers.js';
const router = express.Router();
import {upload} from '../middlewares/multer.middlewares.js'


router.route('/register').post(
    upload.single({
        fieldname: 'profilePicture',
        maxCount: 1

    }),
    registerUser);

export default router;