import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Snackbar,
  Stack,
  Fade,
} from '@mui/material';
import axios from '../../shared/axios';

const MAX_IMAGE_SIZE_MB = 5;

const CommunitySettings = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [community, setCommunity] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    bannerFile: null,
    bannerPreview: '',
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [errors, setErrors] = useState({});
  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    axios.get(`/communities/${id}`).then(res => {
      setCommunity(res.data);
      setForm({
        name: res.data.name,
        description: res.data.description,
        bannerFile: null,
        bannerPreview: res.data.banner || '',
      });
      setIsAdmin(res.data.admins.some(a => (a._id || a).toString() === currentUserId));
    });
  }, [id, currentUserId]);

  useEffect(() => {
    if (community && !isAdmin) {
      navigate(`/communities/${id}`);
    }
  }, [community, isAdmin, navigate, id]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors({ bannerFile: 'Please upload a valid image file.' });
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      setErrors({ bannerFile: `Image size should be less than ${MAX_IMAGE_SIZE_MB}MB.` });
      return;
    }

    setErrors({ bannerFile: null });

    const previewUrl = URL.createObjectURL(file);

    setForm(prev => ({
      ...prev,
      bannerFile: file,
      bannerPreview: previewUrl,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!form.name.trim()) {
      setErrors({ name: 'Community name is required.' });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      if (form.bannerFile) {
        formData.append('banner', form.bannerFile);
      }

      await axios.put(`/communities/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSnackbar({ open: true, message: 'Community updated!' });
      // Optionally refresh community data or redirect
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || 'Failed to update' });
    }
  };

  if (!community) return <Typography>Loading...</Typography>;
  if (community && !isAdmin) return null;

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', py: 4 }}>
      <Typography variant="h4" gutterBottom color="#4a148c" fontWeight="bold">
        Edit Community
      </Typography>

      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>

          {/* Banner Upload */}
          <Box>
            <Typography variant="subtitle1" fontWeight="medium" mb={1} color="#4a148c">
              Banner Image <Typography component="span" color="text.secondary">(Max 5MB)</Typography>
            </Typography>

            <Button
              variant="outlined"
              component="label"
              sx={{
                mb: 1,
                borderColor: '#4a148c',
                color: '#4a148c',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#4a148c',
                  color: 'white',
                },
              }}
            >
              Choose Image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleBannerChange}
              />
            </Button>

            {errors.bannerFile && (
              <Typography variant="caption" color="error" display="block" mb={1}>
                {errors.bannerFile}
              </Typography>
            )}

            <Fade in={!!form.bannerPreview}>
              <Stack direction="row" alignItems="center" spacing={2}>
                {form.bannerPreview && (
                  <Avatar
                    variant="rounded"
                    src={form.bannerPreview}
                    alt="Banner Preview"
                    sx={{ width: 120, height: 80, borderRadius: 2, boxShadow: 3 }}
                  />
                )}
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  Preview of your banner image
                </Typography>
              </Stack>
            </Fade>
          </Box>

          {/* Community Name */}
          <TextField
            label="Community Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors.name}
            helperText={errors.name}
          />

          {/* Description */}
          <TextField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            fullWidth
            multiline
            minRows={3}
          />

          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: '#4a148c',
              '&:hover': { backgroundColor: '#38006b' },
              py: 1.5,
              borderRadius: 2,
              fontWeight: 'bold',
            }}
          >
            Save Changes
          </Button>
        </Stack>
      </form>

      <Box sx={{ mt: 4 }}>
        <Button
          component={Link}
          to={`/communities/${id}/members`}
          variant="outlined"
          sx={{
            borderColor: '#4a148c',
            color: '#4a148c',
            '&:hover': {
              backgroundColor: '#4a148c',
              color: 'white',
            },
          }}
        >
          View & Manage Members
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: '' })}
      />
    </Box>
  );
};

export default CommunitySettings;
