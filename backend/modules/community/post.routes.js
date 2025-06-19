import express from 'express';
import {
  createPost,
  getPosts,
  getReplies,
  deletePost,
  editPost,
  addReaction
} from './post.controller.js';
import { protect } from '../../middleware/authMiddleware.js';
import upload from '../../middleware/multerCloudinary.js'; // Updated import

const router = express.Router({ mergeParams: true });

// All routes now start with /api/communities

// Create a post (with attachments) and get posts
router.route('/:communityId/posts')
  .post(protect, upload.array('attachments', 5), createPost)
  .get(getPosts);

// Get replies for a post
router.get('/:communityId/posts/:postId/replies', getReplies);

// Edit or delete a post
router.route('/:communityId/posts/:postId')
  .put(protect, editPost)
  .delete(protect, deletePost);

// Add a reaction to a post
router.post('/:communityId/posts/:postId/reactions', protect, addReaction);

export default router;
