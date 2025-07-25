import jwt from 'jsonwebtoken';
import User from '../modules/auth/user.model.js';

const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Not authorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      message: error.name === 'TokenExpiredError'
        ? 'Session expired'
        : 'Not authorized'
    });
  }
};

export { protect };
