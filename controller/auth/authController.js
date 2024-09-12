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

export const sendOtpForgotPW = async (req, res) => {
  try {
    const { email } = req.body;
    const subject = "Password Recovery";
    const user = await User.findOne({ email }).select('name');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const randomNumber = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
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

    res.status(200).json({ message: 'OTP sent successfully', content });

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
    const { email, otpCode } = req.body;

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
    const { name, email, password, otp } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const existingOtp = await Otp.findOne({ email });
    if (!existingOtp) {
      return res.status(400).json({ message: 'OTP not found. Please request a new OTP.' });
    }

    if (existingOtp.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (existingOtp.expired < new Date()) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new OTP.' });
    }

    const hashedPassword = hashString(password);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: "customer"
    });

    await newUser.save();
    await Otp.deleteOne({ email });


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

    const existingUser = await User.findOne({ email }).select('name');
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered. Please try logging in.' });
    }

    const randomNumber = Math.floor(Math.random() * 10000).toString().padStart(4, '0');

    // Prepare email content for OTP verification during registration
    const subject = "Account Verification - OTP for Registration";
    const title = "Account Verification";
    const content = `Hello,

We received a request to register an account with your email. Please enter the OTP code below to verify your email and complete the registration:

**Your OTP Code is: <strong>${randomNumber}</strong>**

This code will expire in 10 minutes. If you did not request a registration, please ignore this email.

Thank you for using our services!

Best regards,
The GR5 Team
`;

    const expirationTime = new Date(Date.now() + 10 * 60 * 1000);

    const newOtp = new Otp({
      email,
      otp: randomNumber,
      expired: expirationTime
    });

    const oldOtp = await Otp.findOne({ email });
    if (oldOtp) {
      await Otp.deleteOne({ email });
    }

    await newOtp.save();

    await SendEmail(email, subject, title, content);

    return res.status(200).json({ message: 'OTP sent successfully to email.', content });

  } catch (err) {
    console.error('Error sending OTP:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};