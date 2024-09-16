import mongoose, { Schema } from 'mongoose';

const resultModel = new Schema({
    username: {type: String},
    result: {type: Array, default : []},
    attempts: {type: Number, default: 0},
    points: { type: Number, default: 0},
    achived: {type: String, default: '',
        createAt: {type: Date, default: Date.now}
    }
})

export default mongoose.model('result', resultModel)