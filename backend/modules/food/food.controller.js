import Food from './food.model.js';

const createFoodPost = async (req, res) => {
  const { description, location, availableUntil, contactInfo } = req.body;
  const food = await Food.create({ description, location, availableUntil, contactInfo, postedBy: req.user._id });
  res.status(201).json(food);
};

const getAvailableFood = async (req, res) => {
  const foodItems = await Food.find({ availableUntil: { $gte: new Date() } });
  res.json(foodItems);
};

export { createFoodPost, getAvailableFood };
