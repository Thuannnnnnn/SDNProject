import mongoose from 'mongoose';

const { Schema } = mongoose;

const questionSchema = new Schema({
    question: {
        type: String,
        required: true
    },
    options: {
        type: [String],
        validate: {
            validator: function(v) {
                return v.length > 1; 
            },
            message: 'Options array cannot be empty'
        },
    },
    answer: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Question', questionSchema);
