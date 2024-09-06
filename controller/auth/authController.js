import User from '../../model/userModel.js';
import hashString from '../../utilis/hash256.js';

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

    return res.status(200).json({ message: "Login successful", user });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
