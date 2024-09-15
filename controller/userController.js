import User from "../model/userModel.js";
import connectDB from "../config/connectDB.js";
import dotenv from "dotenv";
dotenv.config();

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, gender, phoneNumber } = req.body;

    const newUser = new User({
      name,
      email,
      password,
      role,
      gender,
      phoneNumber,
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      message: "User created successfully!",
      user: savedUser,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error creating user",
      error: error.message,
    });
  }
};


export const findUserByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    await connectDB();
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const findUserall = async (req, res) => {
  try {
    await connectDB();
    const users = await User.find();

    if (!Array.isArray(users) || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


