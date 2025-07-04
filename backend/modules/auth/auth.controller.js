import User from './user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cloudinary from '../../config/cloudinary.js';
import multer from 'multer';

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Register user
const registerUser = async (req, res) => {
  let { name, username, email, password } = req.body;
  if (!name || !username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  email = email.trim();
  username = username.trim();
  const userExists = await User.findOne({
    $or: [
      { email: { $regex: new RegExp('^' + email + '$', 'i') } },
      { username: { $regex: new RegExp('^' + username + '$', 'i') } }
    ]
  });
  if (userExists) return res.status(400).json({ message: 'User already exists' });
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await User.create({ name, username, email, password: hashedPassword });
  res.status(201).json({
    user: { _id: user._id, name: user.name, email: user.email, username: user.username },
    token: generateToken(user._id)
  });
};

// Login user
const authUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({ _id: user._id, name: user.name, email: user.email, username: user.username, token: generateToken(user._id) });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

// Delete account
const deleteAccount = async (req, res) => {
  if (!req.user || !req.user._id) {
    return res.status(401).json({ message: 'Not authorized' });
  }
  const deletedUser = await User.findByIdAndDelete(req.user._id);
  if (!deletedUser) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.status(200).json({ message: 'Account deleted successfully' });
};

// Get a user's profile
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.params.id).populate('communities');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

// Update a user's profile (with optional avatar upload)
const updateUserProfile = async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    let updateData = {
      name: req.body.name,
      bio: req.body.bio,
      interests: req.body.interests ? req.body.interests.split(',').map(i => i.trim()) : undefined,
    };
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'avatars' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      updateData.avatar = result.secure_url;
    }
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);
    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: 'Update failed', error: error.message });
  }
};

// Block a user
const blockUser = async (req, res) => {
  const blockerId = req.user._id;
  const blockedId = req.params.id;
  if (blockerId.toString() === blockedId) {
    return res.status(400).json({ message: "You can't block yourself." });
  }
  
  res.json({ message: 'User blocked (demo, implement logic as needed).' });
};

export {
  registerUser,
  authUser,
  deleteAccount,
  getUserProfile,
  updateUserProfile,
  upload,
  blockUser
};
