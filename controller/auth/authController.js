import User from "../../model/userModel.js";
import hashString from "../../utilis/hash256.js";
import encode from "../../utilis/jwt.js";
import firebaseAdmin from "../../config/firebase.js";

export const loginWithGoogle = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);

    const { email, name, uid } = decodedToken;
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        email,
        name,
        googleId: uid,
      });
      await user.save();
    }
    const jwtToken = encode(user.email, user.name);
    res.cookie("token", jwtToken, {
      httpOnly: true,
      maxAge: 2 * 60 * 60 * 1000,
    });

    const userWithoutPassword = { ...user._doc };
    delete userWithoutPassword.password;

    return res
      .status(200)
      .json({ message: "Login successful", user: userWithoutPassword });
  } catch (error) {
    if (error.code == "auth/argument-error") {
      return res.status(400).json({ message: "Invalid token" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email doesn't exist" });
    }

    const hashedPassword = hashString(password);

    if (hashedPassword !== user.password) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = encode(user.email, user.name);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 2 * 60 * 60 * 1000,
    });
    const userWithoutPassword = { ...user._doc };
    delete userWithoutPassword.password;

    return res
      .status(200)
      .json({ message: "Login successful", user: userWithoutPassword });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
