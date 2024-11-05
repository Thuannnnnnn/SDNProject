import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const feedbackAndRatingSchema = new Schema({
  userEmail: {
        type: String,
        required: true
    },
    courseId: {
        type: String,
        required: true
    },
    ratingPoint: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    feedback: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

const FeedbackAndRating = model('FeedbackAndRating', feedbackAndRatingSchema);

export default FeedbackAndRating;