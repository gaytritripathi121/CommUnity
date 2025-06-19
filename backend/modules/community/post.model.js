import mongoose from 'mongoose';

const attachmentSchema = new mongoose.Schema({
  filename: String,
  originalname: String,
  mimetype: String,
  path: String,
  size: Number,
});

const postSchema = new mongoose.Schema({
  community: { type: mongoose.Schema.Types.ObjectId, ref: 'Community', required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: false }, // <-- Make content optional
  type: { type: String, enum: ['main', 'discussion', 'reply'], default: 'discussion' },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', default: null },
  pinned: { type: Boolean, default: false },
  reactions: {
    like: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    love: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  mentions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  attachments: [attachmentSchema],
  createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.model('Post', postSchema);
export default Post;
