import express from 'express';
import { getMessages, sendMessage, upload } from './chat.controller.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:userId/:recipientId', protect, getMessages);
router.post('/:recipientId', protect, upload.single('image'), sendMessage);

export default router;
