import { BlobServiceClient } from "@azure/storage-blob";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import Video from "../../model/video/videoModel.js";
import { exec } from "child_process";
import util from "util";
import fs from "fs";

dotenv.config();

const execPromise = util.promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);

const containerClient = blobServiceClient.getContainerClient(
  process.env.CONTAINER_NAME
);

const upload = multer({ storage: multer.memoryStorage() }).single("file");

const convertVideoToHLS = async (tempVideoPath, outputPath) => {
  const ffmpegCommand = `ffmpeg -i "${tempVideoPath}" -codec copy -start_number 0 -hls_time 10 -hls_list_size 0 -f hls "${outputPath}"`;

  await execPromise(ffmpegCommand);
};

export const uploadVideo = async (req, res) => {
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
      const allowedExtension = ".mp4";

      if (fileExtension !== allowedExtension) {
        return res.status(400).json({ error: "Only MP4 files are allowed" });
      }

      const tempDir = path.join(__dirname, 'temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
      }

      const tempVideoPath = path.join(tempDir, file.originalname);
      fs.writeFileSync(tempVideoPath, file.buffer);

      const outputDir = path.join(__dirname, 'output');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
      }

      const videoFileName = uuidv4();
      const outputPath = path.join(outputDir, `${videoFileName}.m3u8`);

      await convertVideoToHLS(tempVideoPath, outputPath);

      const hlsFiles = fs.readdirSync(outputDir).filter(file => file.endsWith('.ts'));

      for (const hlsFile of hlsFiles) {
        const hlsBlobName = `${videoFileName}/${hlsFile}`;
        const hlsBlockBlobClient = containerClient.getBlockBlobClient(hlsBlobName);
        await hlsBlockBlobClient.uploadFile(path.join(outputDir, hlsFile), {
          blobHTTPHeaders: { blobContentType: 'video/MP2T' },
        });
      }


      const m3u8BlobName = `${videoFileName}/${videoFileName}.m3u8`;
      const m3u8BlockBlobClient = containerClient.getBlockBlobClient(m3u8BlobName);
      await m3u8BlockBlobClient.uploadFile(outputPath, {
        blobHTTPHeaders: { blobContentType: 'application/vnd.apple.mpegurl' },
      });


      const newVideo = new Video({
        videoId: uuidv4(),
        title: videoFileName,
        videoLink: `https://sdnmma.blob.core.windows.net/${process.env.CONTAINER_NAME}/${m3u8BlobName}`,
        uploadDate: new Date(),
      });
      await newVideo.save();
      fs.unlinkSync(tempVideoPath);
      hlsFiles.forEach(hlsFile => fs.unlinkSync(path.join(outputDir, hlsFile)));
      fs.unlinkSync(outputPath);

      res.status(200).json({ fileUrl: newVideo.videoLink, newVideo });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ error: "Upload failed" });
    }
  });
};




export const updateVideo = async (req, res) => {
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
      const allowedExtension = ".mp4";

      if (fileExtension !== allowedExtension) {
        return res.status(400).json({ error: "Only MP4 files are allowed" });
      }

      const videoFileName = req.params.blobName;
      const blobPrefix = `${videoFileName}/`; // Folder containing the old files

      // Delete old HLS files from Azure Blob Storage
      for await (const blob of containerClient.listBlobsFlat({ prefix: blobPrefix })) {
        const blockBlobClient = containerClient.getBlockBlobClient(blob.name);
        await blockBlobClient.delete();
      }

      // Convert new video to HLS and upload it
      const tempDir = path.join(__dirname, 'temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
      }

      const tempVideoPath = path.join(tempDir, file.originalname);
      fs.writeFileSync(tempVideoPath, file.buffer);

      const outputDir = path.join(__dirname, 'output');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
      }

      const outputPath = path.join(outputDir, `${videoFileName}.m3u8`);
      await convertVideoToHLS(tempVideoPath, outputPath);

      // Upload new HLS files
      const hlsFiles = fs.readdirSync(outputDir).filter(file => file.endsWith('.ts'));

      for (const hlsFile of hlsFiles) {
        const hlsBlobName = `${videoFileName}/${hlsFile}`;
        const hlsBlockBlobClient = containerClient.getBlockBlobClient(hlsBlobName);
        await hlsBlockBlobClient.uploadFile(path.join(outputDir, hlsFile), {
          blobHTTPHeaders: { blobContentType: 'video/MP2T' },
        });
      }

      // Upload the new .m3u8 file
      const m3u8BlobName = `${videoFileName}/${videoFileName}.m3u8`;
      const m3u8BlockBlobClient = containerClient.getBlockBlobClient(m3u8BlobName);
      await m3u8BlockBlobClient.uploadFile(outputPath, {
        blobHTTPHeaders: { blobContentType: 'application/vnd.apple.mpegurl' },
      });

      // Clean up local temporary files
      fs.unlinkSync(tempVideoPath);
      hlsFiles.forEach(hlsFile => fs.unlinkSync(path.join(outputDir, hlsFile)));
      fs.unlinkSync(outputPath);

      res.status(200).json({ message: "Video updated successfully" });
    } catch (error) {
      console.error("Error updating video:", error);
      return res.status(500).json({ error: "Update failed" });
    }
  });
};


export const deleteVideo = async (req, res) => {
  const videoFileName = req.params.blobName;
  const blobPrefix = `${videoFileName}/`; // Folder containing all HLS files

  try {
    // Delete all blobs in the folder (HLS .ts files and .m3u8 file)
    for await (const blob of containerClient.listBlobsFlat({ prefix: blobPrefix })) {
      const blockBlobClient = containerClient.getBlockBlobClient(blob.name);
      await blockBlobClient.delete();
    }

    // Delete the video entry from the database
    const deletedVideo = await Video.findOneAndDelete({ title : videoFileName });

    if (!deletedVideo) {
      return res.status(404).json({ message: "Video not found in database" });
    }

    res.json({
      message: "Video deleted successfully from storage and database",
    });
  } catch (error) {
    console.error("Error deleting video:", error);
    res.status(500).json({ error: "Delete failed" });
  }
};
