import OrderHistory from "../../model/orderHistory/orderHistory.js";
import { v4 as uuidv4 } from 'uuid';
import SendEmail from "../../utilis/mail.js";
import User from "../../model/userModel.js";
import Course from "../../model/course/courseModel.js";

export const addOrderHistory = async (req, res) => {
  const { userEmail, price, courses } = req.body;

  try {
    if (!userEmail || !price || !courses) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newOrderHistory = new OrderHistory({
      orderId: uuidv4(),
      userEmail,
      price,
      courses,
    });
    await newOrderHistory.save();

    const email = userEmail;
    const user = await User.findOne({ email }).select("name");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const courseNames = await Promise.all(
      courses.map(async (course) => {
        const courseId = course.courseId;
        const courseData = await Course.findById(courseId).select('courseName');
        return courseData ? courseData.courseName : 'Unknown Course';
      })
    );
    const subject = "Order Confirmation";
    const title = "Thank you for your purchase!";
    const content = `
      Hello ${user.name},

      Thank you for your order! We are happy to confirm your purchase.

      Order Details:\n
      - Order ID: ${newOrderHistory.orderId}\n
      - Total Price: ${price}vnd\n
      - Purchased Courses:\n
        ${courseNames.map((name) => `• ${name}`).join('\n')}

      If you have any questions or need support, feel free to reach out.

      Best regards,
      The Team
    `;
    await SendEmail(userEmail, subject, title, content);
    return res.status(201).json({ message: 'Order history added and email sent successfully' });
  } catch (error) {
    console.error('Error adding order history:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};