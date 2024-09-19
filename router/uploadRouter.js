import express from 'express';
import { uploadVideo, updateVideo,deleteVideo } from '../controller/upLoadAzure/azureVideoController.js';
import { uploadImage, updateImage, deleteImage } from '../controller/upLoadAzure/azureImageController.js';

const uploadRouter = express.Router();

uploadRouter.post('/upload_video', uploadVideo);
uploadRouter.put('/update_video/:blobName', updateVideo);
uploadRouter.delete('/delete_video/:blobName', deleteVideo);

uploadRouter.post('/upload_image', uploadImage);
uploadRouter.put('/update_image/:blobName', updateImage);
uploadRouter.delete('/delete_image/:blobName', deleteImage);

export default uploadRouter;