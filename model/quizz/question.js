import mongoose, { Schema } from 'mongoose';

const questionModel = new Schema({
    questions: {type : Array, default: []},
    answwers: {type: Array, default: []},
    createAt: {type: Date, default: Date.now}
})

export default mongoose.model('Question', questionModel);

