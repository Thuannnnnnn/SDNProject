// Import Mongoose
import mongoose from 'mongoose';

// MongoDB connection URI
const uri = "mongodb+srv://thuantqce171329:gUW16YmYclO37yrD@sdn.5oivs.mongodb.net/myDatabase?retryWrites=true&w=majority&appName=SDN";

// Connect to MongoDB Atlas using Mongoose
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB Atlas successfully!');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB Atlas:', err);
  });
