import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  videoId: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  videoLink: {
    type: String,
    required: true,
    unique: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
});

const Video = mongoose.model('Video', videoSchema);
export default Video;
