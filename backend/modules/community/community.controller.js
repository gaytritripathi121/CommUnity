// community.controller.js
import Community from './community.model.js';
import cloudinary from '../../config/cloudinary.js';

// Helper to upload to Cloudinary
const uploadToCloudinary = (fileBuffer, filename) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'community_banners',
        resource_type: 'image',
        public_id: filename ? filename.replace(/\.[^/.]+$/, "") : undefined,
        overwrite: true,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
};

// Create a new community with banner upload to Cloudinary
const createCommunity = async (req, res) => {
  const {
    name,
    description,
    type,
    verifiedLevel,
    locations,
    foundingDate,
    affiliatedNGO,
    missionStatement,
  } = req.body;

  try {
    let bannerUrl;
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, req.file.originalname);
      bannerUrl = uploadResult.secure_url;
    }

    // Convert locations to array
    let locationsArray = [];
    if (locations) {
      if (Array.isArray(locations)) {
        locationsArray = locations;
      } else if (typeof locations === 'string') {
        locationsArray = locations.split(',').map(loc => loc.trim()).filter(Boolean);
      }
    }

    const community = await Community.create({
      name,
      description,
      type,
      banner: bannerUrl,
      verifiedLevel,
      locations: locationsArray,
      foundingDate,
      affiliatedNGO,
      missionStatement,
      members: [req.user._id],
      admins: [req.user._id],
    });

    // Optionally populate members/admins if needed
    await community.populate('members admins');

    res.status(201).json(community);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create community', error: error.message });
  }
};

// Get all communities (optionally filtered by type)
const getCommunities = async (req, res) => {
  const { type } = req.query;
  try {
    const communities = type
      ? await Community.find({ type })
      : await Community.find();
    res.json(communities);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch communities', error: error.message });
  }
};

// Get communities by category (type)
const getCommunitiesByCategory = async (req, res) => {
  try {
    const category = decodeURIComponent(req.params.categoryName);
    const communities = await Community.find({ type: category });
    res.json(communities);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch communities by category', error: error.message });
  }
};

// Get a single community by ID with populated members and admins
const getCommunityById = async (req, res) => {
  const { id } = req.params;
  try {
    const community = await Community.findById(id)
      .populate('members', 'name username avatar _id')
      .populate('admins', '_id');
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }
    res.json(community);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch community', error: error.message });
  }
};

// Join a community
const joinCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) return res.status(404).json({ message: 'Community not found' });

    const userIdStr = req.user._id.toString();
    if (!community.members.some(memberId => memberId.toString() === userIdStr)) {
      community.members.push(req.user._id);
      await community.save();
    }
    res.json({ message: 'Joined community' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to join community', error: error.message });
  }
};

// Promote a member to admin (admin only)
const promoteToAdmin = async (req, res) => {
  const { id, userId } = req.params;
  const community = await Community.findById(id);
  if (!community) return res.status(404).json({ message: 'Community not found' });

  if (!community.admins.some(adminId => adminId.equals(req.user._id))) {
    return res.status(403).json({ message: 'Only admins can promote members' });
  }

  if (
    community.members.some(memberId => memberId.equals(userId)) &&
    !community.admins.some(adminId => adminId.equals(userId))
  ) {
    community.admins.push(userId);
    await community.save();
    return res.json({ message: 'User promoted to admin' });
  } else {
    return res.status(400).json({ message: 'User is not a member or already an admin' });
  }
};

// Update community details (admin only), supports banner image upload via Cloudinary
const updateCommunity = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const community = await Community.findById(id);
    if (!community) return res.status(404).json({ message: 'Community not found' });

    if (!community.admins.some(adminId => adminId.equals(req.user._id))) {
      return res.status(403).json({ message: 'Only admins can edit this community' });
    }

    if (name) community.name = name;
    if (description) community.description = description;

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, req.file.originalname);
      community.banner = uploadResult.secure_url;
    }

    await community.save();
    res.json(community);
  } catch (error) {
    console.error('Update Community Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export {
  createCommunity,
  getCommunities,
  getCommunityById,
  getCommunitiesByCategory,
  joinCommunity,
  promoteToAdmin,
  updateCommunity,
};
