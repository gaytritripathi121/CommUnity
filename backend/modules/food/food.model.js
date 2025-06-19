import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema({
  description: { type: String, required: true },
  location: { type: String, required: true },
  availableUntil: { type: Date, required: true },
  contactInfo: { type: String, required: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Food = mongoose.model('Food', foodSchema);
export default Food;