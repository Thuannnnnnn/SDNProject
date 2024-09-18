import mongoose from 'mongoose';

const users= new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  gender : {
    type : String,
  },
  phoneNumber:{
    type : String,
  },
  // uid: {
  //   type: String,
  // }
});


const User = mongoose.model('User', users);

export default User;
