import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  avatar: { type: String },
  password: { type: String, required: true },
  bio: { type: String },
  interests: [String],
  badges: [String],
  communities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Community' }],
  // blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // For block logic
}, { timestamps: true });

export default mongoose.model('User', userSchema);
