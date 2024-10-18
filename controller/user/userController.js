import User from '../../model/userModel.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // Lấy tất cả người dùng
    res.status(200).json(users); // Gửi phản hồi với danh sách người dùng
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách người dùng', error });
  }
};