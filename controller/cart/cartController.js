import Cart from "../../model/cart/cartModel.js";
import Course from "../../model/course/courseModel.js";

export const getCartByEmail = async (req, res) => {
  try {
    const { userGenerated } = req.query; // Lấy userGenerated từ query params
    const cart = await Cart.findOne({ userGenerated }).populate(
      "courses.courseId"
    );

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json({
      Cart: {
        ...cart.toObject(),
        courses: cart.courses || [],
      },
      message: "Find successful!",
    });
  } catch (error) {
    res.status(500).json({
      message: "Having the error is finding!",
      Error: error.message || "Unknown error",
    });
  }
};

export const addCourseToCart = async (req, res) => {
  try {
    const { cartId, courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const cart = await Cart.findOne({ cartId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.courses.push({ courseId });
    await cart.save();

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const deteleCourse = async (req, res) => {
  try {
    const { cartId, courseId } = req.body;

    const cart = await Cart.findOne({ cartId });
    if (!cart) {
      return res.status(404).json({ massge: "Not Found Cart!" });
    } else if (!courseId) {
      return res.status(404).json({ message: "CourseId not Found" });
    }

    const courseIndex = cart.courses.findIndex(
      (course) => course.courseId.toString() === courseId
    );
    if (courseIndex === -1) {
      return res.status(404).json({ message: "CourseId not Found" });
    }

    cart.courses.splice(courseIndex, 1);
    cart.save();
    res.status(200).json({ message: "Course removed from cart", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
