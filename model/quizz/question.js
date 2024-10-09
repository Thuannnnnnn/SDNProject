import mongoose from "mongoose";

const { Schema } = mongoose; // Đảm bảo dòng này tồn tại

const questionSchema = new Schema({
  questions: [
    {
      question: {
        type: String,
        required: true,
      },
      options: {
        type: [String],
        validate: {
          validator: function (v) {
            return v.length > 1;
          },
          message: "Options array cannot be empty",
        },
      },
      answer: {
        type: Number,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

export default mongoose.model("Question", questionSchema);
