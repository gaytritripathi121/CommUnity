// middleware/multerConfig.js
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js'; // Import the configured instance

const storage = new CloudinaryStorage({
  cloudinary, // Use the already-configured instance
  params: {
    folder: 'uploads',
    resource_type: 'auto',
  },
});

const upload = multer({ storage });

export default upload;
