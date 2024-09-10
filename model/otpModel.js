import mongoose from 'mongoose';

const otps= new mongoose.Schema({
  otp: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  expired: {
    type: Date,
    required: true,
  },
});


const Otp = mongoose.model('Otp', otps);

export default Otp;
