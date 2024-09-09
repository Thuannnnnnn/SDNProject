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
    required : true,
  },
  phoneNumber:{
    type : String,
    required : true,
  },
});


const User = mongoose.model('User', users);

export default User;
