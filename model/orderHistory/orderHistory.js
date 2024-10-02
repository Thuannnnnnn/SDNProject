import mongoose from "mongoose";

const OrderHistoryModel = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true
  },
  courses: [
    {
      courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "courses",
        required: true,
      },
      purchaseDate: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const OrderHistory = mongoose.model("OrderHistory", OrderHistoryModel);

export default OrderHistory;
