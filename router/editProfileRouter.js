import express from 'express';
import { updateProfile, updatePassword, getUserInfo, uploadUserAvatar, deleteUserAvatar} from '../controller/profile/editProfileController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const editProfileRouter = express.Router();


editProfileRouter.put('/update-bio/:userId', authMiddleware, updateProfile);

editProfileRouter.put('/update-password/:userId', authMiddleware, updatePassword);

editProfileRouter.post('/upload-avatar/:userId', authMiddleware, uploadUserAvatar);

editProfileRouter.get('/user-info/:userId', authMiddleware, getUserInfo);

editProfileRouter.delete('/delete-avatar/:userId', authMiddleware, deleteUserAvatar);



export default editProfileRouter;