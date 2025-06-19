import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: String,
  image: String, // Cloudinary URL for image messages
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model('Message', messageSchema);
