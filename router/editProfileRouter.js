import express from 'express';
import { updateProfile, updatePassword, getUserInfo,  getUserImg, updateUserAvatar, uploadUserAvatar} from '../controller/profile/editProfileController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const editProfileRouter = express.Router();


editProfileRouter.put('/update-bio/:userId', authMiddleware, updateProfile);

editProfileRouter.put('/update-password/:userId', authMiddleware, updatePassword);

editProfileRouter.put('/update-avatar/:userId', authMiddleware, updateUserAvatar);

editProfileRouter.post('/upload-avatar/:userId', authMiddleware, uploadUserAvatar);

editProfileRouter.get('/user-info/:userId', authMiddleware, getUserInfo);

editProfileRouter.get('/user-avatar/:userId', authMiddleware, getUserImg);


export default editProfileRouter;