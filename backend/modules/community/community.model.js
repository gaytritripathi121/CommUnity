// community.model.js
import mongoose from 'mongoose';

const communitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  type: {
    type: String,
    enum: [
      'Education',
      'Environment',
      'Food Rescue',
      'LGBTQ+',
      'Mental Health',
      'Animal Welfare',
      'Women Empowerment',
      'Youth Engagement'
    ],
    required: true
  },
  banner: { type: String },
  verifiedLevel: { type: Number, default: 0 },
  locations: [{ type: String }],
  foundingDate: { type: Date },
  affiliatedNGO: { type: String },
  missionStatement: { type: String },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // <-- NEW
  verified: { type: Boolean, default: false }
}, { timestamps: true });

const Community = mongoose.model('Community', communitySchema);
export default Community;
