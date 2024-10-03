import mongoose from "mongoose";

const CoursePurchasedModel = new mongoose.Schema({
  purchaseId: {
    type: String,
    required: true,
    unique: true,
  },
  userEmail: {
    type: String,
    required: true,
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

const CoursePurchased = mongoose.model("CoursePurchased", CoursePurchasedModel);

export default CoursePurchased;
