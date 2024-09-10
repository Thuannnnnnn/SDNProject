import User from '../../model/userModel.js';
import Otp from '../../model/otpModel.js';
import hashString from '../../utilis/hash256.js';
import encode from "../../utilis/jwt.js";
import SendEmail from '../../utilis/mail.js';

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
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 2 * 60 * 60 * 1000,
    });

    const userWithoutPassword = { ...user._doc };
    delete userWithoutPassword.password;

    return res.status(200).json({ message: "Login successful", user: userWithoutPassword });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;  // Corrected from `toSting()`
    const subject = "Password Recovery";
    const user = await User.findOne({ email }).select('name');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const randomNumber = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    const title = "Account Verification - OTP for Password Reset";
    const content = `Hello ${user.name},

We received a request to reset the password for your account. Please enter the OTP code below to verify your identity:

**Your OTP Code is: <strong>${randomNumber}</strong>

This code will expire in 10 minutes. If you did not request a password reset, please ignore this email.

Thank you for using our services!

Best regards,
The GR5 Team
`;
    const expirationTime = new Date(Date.now() + 10 * 60 * 1000);
    const newOtp = new Otp({
      email: email,
      otp: randomNumber,
      expired: expirationTime
    });
    const oldOtp = await Otp.findOne({ email: email });
    if (oldOtp) {
      await Otp.deleteOne({ email: email });
    }
    await newOtp.save();
    await SendEmail(email, subject, title, content);

    res.status(200).json({ message: 'OTP sent successfully' });

  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const isOtpExpired = (otp) => {
  const now = new Date();
  return now > otp.expired;
};


export const validateOtp = async (req, res) => {
  try {
    const { email, otpCode } = req.body;  // Corrected from `req.body`

    const otp = await Otp.findOne({ email: email, otp: otpCode });
    if (!otp) {
      return res.status(404).json({ message: 'OTP not found' });
    }
    if (isOtpExpired(otp)) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    return res.status(200).json({ message: 'OTP is valid' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


export const changePW = async (req, res) => {
  try {
    const { otpCode, email, oldPW, newPW } = req.body;
    const user = await User.findOne({ email });
    const otp = await Otp.findOne({ email: email, otp: otpCode });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (oldPW !== newPW) {
      return res.status(401).json({ message: 'Old password is incorrect' });
    }
    if (!otp) {
      return res.status(404).json({ message: 'OTP not found' });
    }
    if (isOtpExpired(otp)) {
      return res.status(400).json({ message: 'OTP has expired' });
    }
    user.password = hashString(newPW);
    await user.save();
    await Otp.deleteOne({ email: email });
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
  }


};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = hashString(password);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: "customer"
    });
    await newUser.save();


    const subject = "Welcome to GR5";
    const title = "Registration Successful!";
    const content = `Hello ${name},\n\nThank you for registering with GR5. We're excited to have you!\n\nBest regards,\nThe GR5 Team`;
    await SendEmail(email, subject, title, content);

    return res.status(201).json({ message: 'Registration successful, confirmation email sent.' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};


export const sendOtpRegister = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already uses this email, please try another email' });
    }

    const randomNumber = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    const subject = "Your Registration OTP";
    const title = "OTP for Registration";
    const content = `Hello,\n\nYour OTP code for completing the registration is: **Your OTP Code is: <strong>${randomNumber}</strong> Please use this code to verify your account.\n\nBest regards,\nThe GR5 Team`;

    await sendOtp(email, subject, title, content);

    const expirationTime = new Date(Date.now() + 10 * 60 * 1000);
    const newOtp = new Otp({
      email: email,
      otp: randomNumber,
      expired: expirationTime
    });
    const oldOtp = await Otp.findOne({ email: email });
    if (oldOtp) {
      await Otp.deleteOne({ email: email });
    }
    await newOtp.save();

    return res.status(200).json({ message: 'OTP sent successfully to email.' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};