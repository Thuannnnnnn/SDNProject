import mongoose from 'mongoose';

const docsSchema = new mongoose.Schema({
  docsId: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  docsLink: {
    type: String,
    required: true,
    unique: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
});

const Docs = mongoose.model('Docs', docsSchema);
export default Docs;
