import Post from './post.model.js';
import Community from './community.model.js';
import User from '../auth/user.model.js';
import cloudinary from '../../config/cloudinary.js';
import streamifier from 'streamifier';

// Helper to upload a single file buffer to Cloudinary
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'your-app-folder', resource_type: 'auto' }, // change folder if you want
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

// Recursive delete helper to delete a post and all its replies
async function deletePostAndReplies(postId) {
  const replies = await Post.find({ parent: postId });
  for (const reply of replies) {
    await deletePostAndReplies(reply._id);
  }
  await Post.deleteOne({ _id: postId });
}

// Create post with attachments OR content OR both
export const createPost = async (req, res) => {
  try {
    const { content, type, parent } = req.body;
    const hasContent = content && content.trim() !== '';
    const hasAttachments = req.files && req.files.length > 0;

    // Allow post if either content or at least one attachment is present
    if (!hasContent && !hasAttachments) {
      return res.status(400).json({ message: 'Content or at least one attachment is required' });
    }

    const community = await Community.findById(req.params.communityId);
    if (!community) return res.status(404).json({ message: 'Community not found' });

    const allowedTypes = ['main', 'discussion', 'reply'];
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ message: 'Invalid post type' });
    }

    let isAdmin = false;
    if (Array.isArray(community.admins)) {
      isAdmin = community.admins.some(adminId => adminId.equals(req.user._id));
    }
    if (community.owner && community.owner.equals(req.user._id)) {
      isAdmin = true;
    }

    if (type === 'main' && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to post in main section' });
    } else if (type !== 'main') {
      if (!Array.isArray(community.members) || !community.members.some(memberId => memberId.equals(req.user._id))) {
        return res.status(403).json({ message: 'Join the community to post' });
      }
    }

    // Parse mentions (@username)
    const mentions = [];
    const mentionRegex = /@(\w+)/g;
    if (hasContent) {
      let match;
      while ((match = mentionRegex.exec(content))) {
        const user = await User.findOne({ name: match[1] });
        if (user) mentions.push(user._id);
      }
    }

    // Upload files to Cloudinary and collect their info
    let attachments = [];
    if (hasAttachments) {
      attachments = await Promise.all(
        req.files.map(async (file) => {
          const result = await uploadToCloudinary(file.buffer);
          return {
            url: result.secure_url,
            public_id: result.public_id,
            mimetype: file.mimetype,
            originalname: file.originalname,
            size: file.size,
          };
        })
      );
    }

    const post = await Post.create({
      community: community._id,
      author: req.user._id,
      content: hasContent ? content : '', // Save as empty string if no content
      type,
      parent: parent || null,
      mentions,
      attachments,
    });

    res.status(201).json(post);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getPosts = async (req, res) => {
  try {
    const { type, page = 1, limit = 100 } = req.query;
    const skip = (page - 1) * limit;

    const query = {
      community: req.params.communityId,
      ...(type && { type }),
    };

    const posts = await Post.find(query)
      .populate('author', 'name email')
      .populate('mentions', 'name')
      .sort({ pinned: -1, createdAt: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Post.countDocuments(query);

    res.json({
      posts,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getReplies = async (req, res) => {
  try {
    const replies = await Post.find({ parent: req.params.postId })
      .populate('author', 'name email')
      .sort({ createdAt: 1 });
    res.json(replies);
  } catch (error) {
    console.error('Get replies error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const editPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const community = await Community.findById(post.community);
    if (!community) return res.status(404).json({ message: 'Community not found' });

    let isAdmin = false;
    if (Array.isArray(community.admins)) {
      isAdmin = community.admins.some(adminId => adminId.equals(req.user._id));
    }
    if (community.owner && community.owner.equals(req.user._id)) {
      isAdmin = true;
    }

    if (!post.author.equals(req.user._id) && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    post.content = req.body.content || post.content;
    post.pinned = req.body.pinned ?? post.pinned;
    await post.save();
    res.json(post);
  } catch (error) {
    console.error('Edit post error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const community = await Community.findById(post.community);
    if (!community) return res.status(404).json({ message: 'Community not found' });

    let isAdmin = false;
    if (Array.isArray(community.admins)) {
      isAdmin = community.admins.some(adminId => adminId.equals(req.user._id));
    }
    if (community.owner && community.owner.equals(req.user._id)) {
      isAdmin = true;
    }

    if (!post.author.equals(req.user._id) && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await deletePostAndReplies(post._id);
    res.json({ message: 'Post and all replies deleted' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const addReaction = async (req, res) => {
  try {
    const { reaction } = req.body;
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const reactionField = `reactions.${reaction}`;
    const hasReacted = post.reactions[reaction]?.includes(req.user._id);

    if (hasReacted) {
      await Post.updateOne(
        { _id: post._id },
        { $pull: { [reactionField]: req.user._id } }
      );
    } else {
      await Post.updateOne(
        { _id: post._id },
        { $addToSet: { [reactionField]: req.user._id } }
      );
    }

    res.json({ message: 'Reaction updated' });
  } catch (error) {
    console.error('Add reaction error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
