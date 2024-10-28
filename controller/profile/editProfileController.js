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

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('avatar');

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

const validExtensions = ['.png', '.jpg', '.jpeg'];

export const getUserImg = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    let fileFound = false;
    let avatarUrl = '';

    for (const ext of validExtensions) {
      const blobName = `${userId}${ext}`;
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      if (await blockBlobClient.exists()) {
        fileFound = true;
        avatarUrl = blockBlobClient.url;
        break;
      }
    }

    if (!fileFound) {
      return res.status(404).json({ message: "Avatar not found" });
    }

    return res.status(200).json({ avatarUrl });
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
      return res.status(400).json({ error: err.message });
    }

    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const blobName = `${userId}${path.extname(file.originalname).toLowerCase()}`;
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      await blockBlobClient.uploadData(file.buffer, {
        blobHTTPHeaders: { blobContentType: file.mimetype },
      });

      const fileUrl = blockBlobClient.url;

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { avatarUrl: fileUrl },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({
        message: "Image uploaded successfully",
        fileUrl,
        user: updatedUser,
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      return res.status(500).json({ error: "Failed to upload image" });
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
      return res.status(400).json({ error: err.message });
    }

    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      let fileFound = false;

      for (const ext of validExtensions) {
        const blobName = `${userId}${ext}`;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        if (await blockBlobClient.exists()) {
          fileFound = true;
          await blockBlobClient.delete();
          break;
        }
      }

      const blobName = `${userId}${path.extname(file.originalname).toLowerCase()}`;
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      await blockBlobClient.uploadData(file.buffer, {
        blobHTTPHeaders: { blobContentType: file.mimetype },
      });

      const fileUrl = blockBlobClient.url;

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { avatarUrl: fileUrl },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({
        message: "Image updated successfully",
        fileUrl,
        user: updatedUser,
      });
    } catch (error) {
      console.error("Error updating image:", error);
      return res.status(500).json({ error: "Failed to update image" });
    }
  });
};

export const deleteUserAvatar = async (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    let fileFound = false;

    for (const ext of validExtensions) {
      const blobName = `${userId}${ext}`;
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      if (await blockBlobClient.exists()) {
        fileFound = true;
        await blockBlobClient.delete();
        break;
      }
    }

    if (!fileFound) {
      return res.status(404).json({ message: "Avatar not found" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { avatarUrl: "" },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Avatar deleted successfully",
      user,
    });
  } catch (error) {
    console.error("Error deleting image:", error);
    return res.status(500).json({ error: "Failed to delete image" });
  }
};