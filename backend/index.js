import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import connectDB from './config/db.js';
import communityRoutes from './modules/community/community.routes.js';
import authRoutes from './modules/auth/auth.routes.js';
import chatRoutes from './modules/chat/chat.routes.js';
import postRoutes from './modules/community/post.routes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();
console.log('Loaded Cloudinary Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);

connectDB();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const __dirname = path.resolve();
app.post('/test-upload', upload.array('attachments', 5), (req, res) => {
  console.log('BODY:', req.body);
  console.log('FILES:', req.files);
  res.json({ body: req.body, files: req.files });
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/communities', communityRoutes);
app.use('/api/communities', postRoutes);
app.use('/api/chat', chatRoutes);

// Multer error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Max size is 10MB.' });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ message: err.message || 'Unsupported file type.' });
    }
    return res.status(400).json({ message: err.message });
  }
  next(err);
});

// --- GLOBAL ERROR HANDLER (add this just before app.listen) ---
app.use((err, req, res, next) => {
  // Log the full error stack to your backend terminal
  console.error('--- GLOBAL ERROR HANDLER ---');
  console.error(err.stack || err);

  // Send error details to client (don't send stack in production)
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    // error: err.stack, // Uncomment for debugging, comment out in production
  });
});
// --------------------------------------------------------------

app.use(notFound);
app.use(errorHandler);

if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(frontendPath));

  // Safe wildcard route to avoid path-to-regexp crash
  app.get("/{*splat}", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
