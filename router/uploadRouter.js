import express from "express";
import {
  uploadVideo,
  updateVideo,
  deleteVideo,
} from "../controller/upLoadAzure/azureVideoController.js";
import {
  uploadImage,
  updateImage,
  deleteImage,
} from "../controller/upLoadAzure/azureImageController.js";
import { deleteDocs, updateDocs, uploadDocs } from "../controller/upLoadAzure/azureDocsController.js";

const uploadRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Video Management
 *   description: Video upload, update, and delete operations
 */

/**
 * @swagger
 * /api/upload/upload_video:
 *   post:
 *     tags: [Video Management]
 *     summary: Upload a new video
 *     description: Upload a new video file (MP4 format).
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The MP4 video file to upload
 *               title:
 *                 type: string
 *                 example: Introduction Video
 *                 description: Title of the video
 *     responses:
 *       200:
 *         description: Video uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fileUrl:
 *                   type: string
 *                   example: https://blobstorageaccount.blob.core.windows.net/container/uuid.mp4
 *                 blobName:
 *                   type: string
 *                   example: uuid.mp4
 *                 newVideo:
 *                   type: object
 *                   description: Details of the uploaded video
 *       400:
 *         description: Only MP4 files are allowed
 *       500:
 *         description: Upload failed
 */
uploadRouter.post("/upload_video", uploadVideo);

/**
 * @swagger
 * /api/upload/update_video/{blobName}:
 *   put:
 *     tags: [Video Management]
 *     summary: Update an existing video
 *     description: Replace an existing video file by providing its blob name.
 *     parameters:
 *       - in: path
 *         name: blobName
 *         required: true
 *         description: The name of the video file to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The new MP4 video file
 *     responses:
 *       200:
 *         description: Video updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fileUrl:
 *                   type: string
 *                   example: https://blobstorageaccount.blob.core.windows.net/container/uuid.mp4
 *       400:
 *         description: Only MP4 files are allowed
 *       404:
 *         description: Video not found
 *       500:
 *         description: Upload failed
 */
uploadRouter.put("/update_video/:blobName", updateVideo);

/**
 * @swagger
 * /api/upload/delete_video/{blobName}:
 *   delete:
 *     tags: [Video Management]
 *     summary: Delete a video
 *     description: Delete a video file from Azure Blob Storage by providing its blob name.
 *     parameters:
 *       - in: path
 *         name: blobName
 *         required: true
 *         description: The name of the video file to delete
 *         schema:
 *           type: string
 *           example: uuid.mp4
 *     responses:
 *       200:
 *         description: Video deleted successfully
 *       404:
 *         description: Video not found
 *       500:
 *         description: Delete failed
 */
uploadRouter.delete("/delete_video/:blobName", deleteVideo);

/**
 * @swagger
 * tags:
 *   name: Image Management
 *   description: Image upload, update, and delete operations
 */

/**
 * @swagger
 * /api/upload/upload_image:
 *   post:
 *     tags: [Image Management]
 *     summary: Upload a new image
 *     description: Upload a new image file (e.g., PNG, JPG).
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               contentId:
 *                 type: string
 *                 example: "content123"
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The image file to upload
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fileUrl:
 *                   type: string
 *                   example: https://blobstorageaccount.blob.core.windows.net/container/uuid.png
 *                 blobName:
 *                   type: string
 *                   example: uuid.png
 *       500:
 *         description: Upload failed
 */
uploadRouter.post("/upload_image", uploadImage);

/**
 * @swagger
 * /api/upload/update_image/{blobName}:
 *   put:
 *     tags: [Image Management]
 *     summary: Update an existing image
 *     description: Replace an existing image file by providing its blob name.
 *     parameters:
 *       - in: path
 *         name: blobName
 *         required: true
 *         description: The name of the image file to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The new image file
 *     responses:
 *       200:
 *         description: Image updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fileUrl:
 *                   type: string
 *                   example: https://blobstorageaccount.blob.core.windows.net/container/uuid.png
 *       404:
 *         description: Image not found
 *       500:
 *         description: Upload failed
 */
uploadRouter.put("/update_image/:blobName", updateImage);

/**
 * @swagger
 * /api/upload/delete_image/{blobName}:
 *   delete:
 *     tags: [Image Management]
 *     summary: Delete an image
 *     description: Delete an image file from Azure Blob Storage by providing its blob name.
 *     parameters:
 *       - in: path
 *         name: blobName
 *         required: true
 *         description: The name of the image file to delete
 *         schema:
 *           type: string
 *           example: uuid.png
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *       404:
 *         description: Image not found
 *       500:
 *         description: Delete failed
 */
uploadRouter.delete("/delete_image/:blobName", deleteImage);

/**
 * @swagger
 * /api/upload/upload_docs:
 *   post:
 *     tags: [Docs Management]
 *     summary: Upload a new doc
 *     description: Upload a new doc file (e.g., docx, PDF).
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The doc file to upload
 *               title:
 *                 type: string
 *                 example: Introduction Video
 *                 description: Title of the document
 *     responses:
 *       200:
 *         description: doc uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fileUrl:
 *                   type: string
 *                   example: https://blobstorageaccount.blob.core.windows.net/container/uuid.png
 *                 blobName:
 *                   type: string
 *                   example: uuid.png
 *                 title:
 *                   type: string
 *                   example: Introduction Video
 *                   description: Title of the document
 *       500:
 *         description: Upload failed
 */
uploadRouter.post("/upload_docs", uploadDocs);

uploadRouter.put("/update_docs/:blobName", updateDocs);

uploadRouter.delete("/delete_docs/:blobName", deleteDocs);
export default uploadRouter;
