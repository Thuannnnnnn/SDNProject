import User from "../../model/userModel.js";
import crypto from "crypto";
import { BlobServiceClient } from "@azure/storage-blob";
import multer from "multer";
import path from "path";

const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);

const containerClient = blobServiceClient.getContainerClient(
  process.env.CONTAINER_NAME
);

const upload = multer({ storage: multer.memoryStorage() }).single("file");

export const updateProfile = async (req, res) => {
  const { userId } = req.params;
  const { name, email, gender, phoneNumber } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.name = name || user.name;
    user.email = email || user.email;
    user.gender = gender || user.gender;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation error", error: error.message });
    }
    res
      .status(500)
      .json({ message: "Error updating profile", error: error.message });
  }
};

export const updatePassword = async (req, res) => {
  const { userId } = req.params;
  const { oldPassword, newPassword, reNewPassword } = req.body;

  if (!oldPassword || !newPassword || !reNewPassword) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const user = await User.findById(userId).select("password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const hashOldPassword = crypto
      .createHash("sha256")
      .update(oldPassword)
      .digest("hex");
    if (hashOldPassword !== user.password) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }
    if (newPassword !== reNewPassword) {
      return res
        .status(400)
        .json({
          message: "New password and confirmation password do not match",
        });
    }
    const hashNewPassword = crypto
      .createHash("sha256")
      .update(newPassword)
      .digest("hex");
    user.password = hashNewPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res
      .status(500)
      .json({ message: "Error updating password", error: error.message });
  }
};

export const getUserInfo = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error fetching user information",
        error: error.message,
      });
  }
};

export const getUserImg = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const blobName = `${userId}.png`.trim();
    if (!blobName || blobName === ".png") {
      return res.status(400).json({ message: "Invalid image name" });
    }

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    try {
      const exists = await blockBlobClient.exists();

      if (!exists) {
        return res.status(404).json({ message: "avatar is null" });
      }

      const fileUrl = blockBlobClient.url;
      return res.status(200).json({ fileUrl });
    } catch (existsError) {
      console.error("Error checking image existence:", existsError);
      return res.status(500).json({ error: "Failed to check image existence" });
    }
  } catch (error) {
    console.error("Error fetching image by user ID:", error);
    return res.status(500).json({ error: "Failed to fetch image" });
  }
};

export const uploadUserAvatar = async (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

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
      const blobName = `${userId}${fileExtension}`;
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      const exists = await blockBlobClient.exists();
      if (exists) {
        return res
          .status(400)
          .json({
            message:
              "Image already exists. Use update endpoint to change the avatar.",
          });
      }

      await blockBlobClient.uploadData(file.buffer, {
        blobHTTPHeaders: { blobContentType: file.mimetype },
      });

      const fileUrl = blockBlobClient.url;
      return res
        .status(200)
        .json({ message: "Image uploaded successfully", fileUrl });
    } catch (error) {
      console.error("Error uploading image:", error);
      return res.status(500).json({ error: "Upload failed" });
    }
  });
};

export const updateUserAvatar = async (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

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
      const blobName = `${userId}${fileExtension}`;
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      const exists = await blockBlobClient.exists();
      if (!exists) {
        return res
          .status(404)
          .json({
            message:
              "No existing image found. Use upload endpoint to add a new avatar.",
          });
      }

      await blockBlobClient.uploadData(file.buffer, {
        blobHTTPHeaders: { blobContentType: file.mimetype },
      });

      const fileUrl = blockBlobClient.url;
      return res
        .status(200)
        .json({ message: "Image updated successfully", fileUrl });
    } catch (error) {
      console.error("Error updating image:", error);
      return res.status(500).json({ error: "Failed to update image" });
    }
  });
};
