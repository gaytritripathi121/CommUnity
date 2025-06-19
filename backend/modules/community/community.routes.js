import express from 'express';
import upload from '../../middleware/multerConfig.js';
import {
  createCommunity,
  getCommunities,
  getCommunityById,
  getCommunitiesByCategory,
  joinCommunity,
  promoteToAdmin,
  updateCommunity,
} from './community.controller.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

// Multer middleware added to POST create route
router.post('/', protect, upload.single('banner'), createCommunity);

router.get('/', getCommunities);
router.get('/category/:categoryName', getCommunitiesByCategory);
router.post('/:id/join', protect, joinCommunity);
router.get('/:id', getCommunityById);
router.put('/:id', protect, upload.single('banner'), updateCommunity);
router.put('/:id/members/:userId/promote', protect, promoteToAdmin);

export default router;
