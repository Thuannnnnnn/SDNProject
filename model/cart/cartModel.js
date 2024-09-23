import mongoose from "mongoose";

const CartModel = new mongoose.Schema({
  cartId: {
    type: String,
    require: true,
    unique: true,
  },
  courses: [
    {
      courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Courses",
        required: true,
      },
      updateDate: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  userGenerated: {
    type: String,
    required: true,
  },
});

const Cart = mongoose.model("Cart", CartModel);

export default Cart;
