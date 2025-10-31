import express from 'express';
import { changeCurrentPAssword, getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails, updateUserAvtar } from '../controllers/user.controllers.js';
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
router.route('/update_password').post(verifyJWT, changeCurrentPAssword);
router.route('/current_user').get(verifyJWT, getCurrentUser);
router.route('/update_user').patch(verifyJWT, updateAccountDetails);

router.route('/update_avatar').patch(verifyJWT, upload.single('avatar'), updateUserAvtar)


export default router;