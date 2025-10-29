import express from 'express';
import { loginUser, logoutUser, refreshAccessToken, registerUser } from '../controllers/user.controllers.js';
import { verifyJWT } from '../middlewares/auth.middlewares.js';
const router = express.Router();
import {upload} from '../middlewares/multer.middlewares.js'


router.route('/register').post(
    upload.single('avatar'),
    registerUser);

router.route('/login').post(loginUser);

// Secured Routes
router.route('/logout').post(verifyJWT, logoutUser);
router.route('/refresh_token').post(refreshAccessToken);

export default router;