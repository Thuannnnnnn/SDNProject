import express from 'express';
import { uploadVideo, updateVideo,deleteVideo } from '../controller/upLoadAzure/azureVideoController.js';

const uploadRouter = express.Router();

uploadRouter.post('/upload_video', uploadVideo);
uploadRouter.put('/update_video/:blobName', updateVideo);
uploadRouter.delete('/delete_video/:blobName', deleteVideo);

export default uploadRouter;