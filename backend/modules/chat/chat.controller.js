import Message from './message.model.js';
import cloudinary from '../../config/cloudinary.js';
import multer from 'multer';

const storage = multer.memoryStorage();
export const upload = multer({ storage });

// Get private messages with sender info populated
export const getMessages = async (req, res) => {
  const { userId, recipientId } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { sender: userId, recipient: recipientId },
        { sender: recipientId, recipient: userId }
      ]
    })
    .sort('timestamp')
    .populate('sender', 'name avatar'); // Populate sender's name and avatar fields only

   
    const formattedMessages = messages.map(msg => ({
      _id: msg._id,
      text: msg.text,
      image: msg.image,
      sender: msg.sender._id,
      senderName: msg.sender.name,
      senderAvatar: msg.sender.avatar,
      timestamp: msg.timestamp,
    }));

    res.json(formattedMessages);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get messages', error: error.message });
  }
};


export const sendMessage = async (req, res) => {
  try {
    let imageUrl = null;
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'messages' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });
      imageUrl = result.secure_url;
    }

    const message = await Message.create({
      sender: req.user._id,
      recipient: req.params.recipientId,
      text: req.body.text,
      image: imageUrl,
    });
    res.json(message);
  } catch (error) {
    res.status(400).json({ message: 'Failed to send message', error: error.message });
  }
};
