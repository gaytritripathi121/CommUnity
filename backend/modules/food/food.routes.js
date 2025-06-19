import express from 'express';
import { createFoodPost, getAvailableFood } from './food.controller.js';
import { protect } from '../../middleware/authMiddleware.js';
const router = express.Router();

router.get('/', getAvailableFood);
router.post('/', protect, createFoodPost);

export default router;