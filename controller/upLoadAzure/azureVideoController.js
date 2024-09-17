import { BlobServiceClient } from '@azure/storage-blob';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();


const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);

const containerClient = blobServiceClient.getContainerClient(process.env.CONTAINER_NAME);


const upload = multer({ storage: multer.memoryStorage() }).single('file');


export const uploadVideo = async (req, res) => {

  upload(req, res, async function (err) {
    if (err) {
      return res.status(500).json({ error: 'File upload error' });
    }

    try {

      const blobName = uuidv4() + path.extname(req.file.originalname);
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);


      await blockBlobClient.uploadData(req.file.buffer, {
        blobHTTPHeaders: { blobContentType: req.file.mimetype }
      });


      const fileUrl = blockBlobClient.url;
      res.status(200).json({ fileUrl, blobName });
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ error: 'Upload failed' });
    }
  });
};

export const updateVideo = async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(500).json({ error: 'File upload error' });
    }
    try {
      const blobName = req.params.blobName;
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      await blockBlobClient.uploadData(req.file.buffer, {
        blobHTTPHeaders: { blobContentType: req.file.mimetype }
      });
      const fileUrl = blockBlobClient.url;
      return res.status(200).json({ fileUrl });
    } catch (error) {
      console.error('Error uploading file:', error);
      return res.status(500).json({ error: 'Upload failed' });
    }
  });
};

export const deleteVideo = async(req, res)=>{
  upload(req, res, async function (err) {
    if (err) {
      return res.status(500).json({ error: 'File upload error' });
    }
    const blobName = req.params.blobName;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    try {
      await blockBlobClient.delete();
      res.json({ message: 'File deleted successfully' });
    } catch (error) {
      console.error('Error deleting file:', error);
      res.status(500).json({ error: 'Delete failed' });
    }
  });
};
