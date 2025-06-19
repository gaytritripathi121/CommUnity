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
import upload from '../../middleware/multerCloudinary.js';

const router = express.Router({ mergeParams: true });

router.route('/:communityId/posts')
  .post(protect, upload.array('attachments', 10), createPost)
  .get(getPosts);

router.get('/:communityId/posts/:postId/replies', getReplies);

router.route('/:communityId/posts/:postId')
  .put(protect, editPost)
  .delete(protect, deletePost);

router.post('/:communityId/posts/:postId/reactions', protect, addReaction);

export default router;
