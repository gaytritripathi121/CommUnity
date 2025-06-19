import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  Stack,
  Avatar,
  Typography,
  CircularProgress,
  Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import UserAPI from './UserAPI';
import { PhotoCamera } from '@mui/icons-material';

const EditProfilePage = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    interests: '',
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user info on mount
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/login');
      return;
    }
    UserAPI.getUser(userId)
      .then((u) => {
        setUser(u);
        setFormData({
          name: u.name || '',
          bio: u.bio || '',
          interests: u.interests ? u.interests.join(', ') : '',
        });
        setPreview(u.avatar || '');
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        navigate('/settings'); // fallback
      });
  }, [navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatarFile(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    const data = new FormData();
    data.append('name', formData.name);
    data.append('bio', formData.bio);
    data.append('interests', formData.interests);
    if (avatarFile) data.append('avatar', avatarFile);

    try {
      await UserAPI.updateUser(user._id, data);
      navigate('/settings');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    navigate('/settings');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      maxWidth="sm"
      mx="auto"
      mt={4}
      p={{ xs: 1, md: 2 }}
      sx={{
        background: 'linear-gradient(135deg, #f3e5f5 0%, #ce93d8 100%)',
        borderRadius: 4,
        boxShadow: '0 8px 40px rgba(123,31,162,0.08)',
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: 900,
          color: '#7b1fa2',
          letterSpacing: 1,
          textAlign: 'center',
        }}
      >
        Edit Profile
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            textAlign: 'center',
            background: '#fff',
            boxShadow: '0 4px 24px #ce93d8',
          }}
        >
          <Stack spacing={1} alignItems="center">
            <Avatar
              src={preview}
              sx={{
                width: 100,
                height: 100,
                mb: 1,
                border: '4px solid #ce93d8',
                boxShadow: '0 2px 8px #ba68c8',
                backgroundColor: '#f3e5f5',
              }}
            />
            <Button
              variant="contained"
              component="label"
              startIcon={<PhotoCamera />}
              sx={{
                backgroundColor: '#7b1fa2',
                color: '#fff',
                fontWeight: 700,
                borderRadius: 2,
                px: 3,
                py: 1,
                minWidth: 150,
                textTransform: 'none',
                '&:hover': { backgroundColor: '#6a1b9a' }
              }}
            >
              Upload Avatar
              <input hidden accept="image/*" type="file" onChange={handleAvatarChange} />
            </Button>
          </Stack>
        </Paper>

        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mt: 2, background: '#fff', borderRadius: 2 }}
        />
        <TextField
          label="Bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          fullWidth
          multiline
          rows={3}
          sx={{ mt: 2, background: '#fff', borderRadius: 2 }}
        />
        <TextField
          label="Interests (comma separated)"
          name="interests"
          value={formData.interests}
          onChange={handleChange}
          fullWidth
          sx={{ mt: 2, background: '#fff', borderRadius: 2 }}
        />

        <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: 'center' }}>
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: '#7b1fa2',
              color: '#fff',
              fontWeight: 700,
              borderRadius: 2,
              px: 4,
              py: 1,
              minWidth: 120,
              textTransform: 'none',
              '&:hover': { backgroundColor: '#6a1b9a' }
            }}
          >
            Save
          </Button>
          <Button
            variant="outlined"
            onClick={handleCancel}
            sx={{
              borderColor: '#7b1fa2',
              color: '#7b1fa2',
              fontWeight: 700,
              borderRadius: 2,
              px: 4,
              py: 1,
              minWidth: 120,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#f3e5f5',
                borderColor: '#6a1b9a',
                color: '#6a1b9a'
              }
            }}
          >
            Cancel
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default EditProfilePage;
