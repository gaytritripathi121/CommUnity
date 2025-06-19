import express from 'express';
import {
  registerUser,
  authUser,
  deleteAccount,
  getUserProfile,
  updateUserProfile,
  upload,
  blockUser
} from './auth.controller.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.delete('/me', protect, deleteAccount);

// User profile routes
router.get('/profile/:id', protect, getUserProfile);
router.put('/profile/:id', protect, upload.single('avatar'), updateUserProfile);

// Block user
router.post('/block/:id', protect, blockUser);

export default router;
