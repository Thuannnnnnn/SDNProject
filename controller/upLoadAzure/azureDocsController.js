import { BlobServiceClient } from "@azure/storage-blob";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import dotenv from "dotenv";
import Docs from "../../model/docs/docsModel.js";

dotenv.config();

const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);

const containerClient = blobServiceClient.getContainerClient(
  process.env.CONTAINER_NAME
);

const upload = multer({ storage: multer.memoryStorage() }).single("file");

export const uploadDocs = async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(500).json({ error: "File upload error" });
    }

    try {
      const file = req.file;
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }
      const fileExtension = path.extname(file.originalname).toLowerCase();
      const blobName = uuidv4() + fileExtension;
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      await blockBlobClient.uploadData(file.buffer, {
        blobHTTPHeaders: { blobContentType: req.file.mimetype },
      });
      const fileUrl = blockBlobClient.url;
      const DocFileName = path.basename(file.originalname, fileExtension);
      const newDocs = new Docs({
        docsId: blobName,
        title: DocFileName,
        docsLink: fileUrl,
        uploadDate: new Date(),
      });

      // Lưu video vào cơ sở dữ liệu
      await newDocs.save();
      res.status(200).json({ fileUrl, blobName, newDocs });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ error: "Upload failed" });
    }
  });
};

export const updateDocs = async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(500).json({ error: "File upload error" });
    }
    try {
      const file = req.file;
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }
      const blobName = req.params.blobName;
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      await blockBlobClient.uploadData(file.buffer, {
        blobHTTPHeaders: { blobContentType: req.file.mimetype },
      });
      const fileUrl = blockBlobClient.url;
      return res.status(200).json({ fileUrl });
    } catch (error) {
      console.error("Error uploading file:", error);
      return res.status(500).json({ error: "Upload failed" });
    }
  });
};

export const deleteDocs = async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(500).json({ error: "File upload error" });
    }

    const blobName = req.params.blobName;

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    try {
      await blockBlobClient.delete();
      const docsId = blobName;
      const deletedDoc = await Docs.findOneAndDelete({ docsId });
      if (!deletedDoc) {
        return res
          .status(404)
          .json({ message: "Document not found in database" });
      }

      res.json({
        message: "File deleted successfully and document removed from database",
      });
    } catch (error) {
      console.error("Error deleting file:", error);
      res.status(500).json({ error: "Delete failed" });
    }
  });
};
