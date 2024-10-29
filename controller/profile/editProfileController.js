import User from "../../model/userModel.js";
import crypto from "crypto";
import { BlobServiceClient } from "@azure/storage-blob";
import multer from "multer";


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

  try {
    const { avatarBase64 } = req.body; // Get the base64 data from request body
    if (!avatarBase64) {
      return res.status(400).json({ message: "No image data provided" });
    }

    // Decode the Base64 string
    const buffer = Buffer.from(avatarBase64.split(',')[1], 'base64'); // Split to get raw base64 data

    // Create a blob name with a file extension (e.g., .jpg, .png)
    const blobName = `${userId}.jpg`; // Change the extension as needed
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Upload the buffer to Azure Blob Storage
    await blockBlobClient.uploadData(buffer, {
      blobHTTPHeaders: { blobContentType: 'image/jpeg' }, // Change to the appropriate content type
    });

    const fileUrl = blockBlobClient.url;

    // Update user information with the new avatar URL
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
};

// Function to update user avatar (similar to upload)
export const updateUserAvatar = async (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const { avatarBase64 } = req.body; // Get the base64 data from request body
    if (!avatarBase64) {
      return res.status(400).json({ message: "No image data provided" });
    }

    const buffer = Buffer.from(avatarBase64.split(',')[1], 'base64'); // Split to get raw base64 data

    // Delete old file if exists (same logic as before)

    const blobName = `${userId}.jpg`; // Change the extension as needed
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Upload the buffer to Azure Blob Storage
    await blockBlobClient.uploadData(buffer, {
      blobHTTPHeaders: { blobContentType: 'image/jpeg' }, // Change to the appropriate content type
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