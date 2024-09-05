import User from '../model/userModel.js';

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
      message: 'User created successfully!',
      user: savedUser
    });
  } catch (error) {

    res.status(400).json({
      message: 'Error creating user',
      error: error.message
    });
  }
};
export const findUserByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
