// CreateCommunityForm.jsx
import React, { useState } from 'react';
import {
  Box, Button, Container, TextField, Typography, MenuItem, FormControl, InputLabel,
  Select, Avatar, Stack, Paper, Fade,
} from '@mui/material';
import { COMMUNITY_TYPES } from '@shared/constants';
import { useNavigate } from 'react-router-dom';
import { createCommunity } from '../communityAPI';

const VERIFIED_LEVELS = [
  { label: 'None', value: 0 },
  { label: 'Silver', value: 1 },
  { label: 'Gold', value: 2 },
  { label: 'Platinum', value: 3 },
];

const MAX_IMAGE_SIZE_MB = 5;

const CreateCommunityForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    description: '',
    type: '',
    bannerFile: null,
    bannerPreview: '',
    verifiedLevel: 0,
    locations: '',
    foundingDate: '',
    affiliatedNGO: '',
    missionStatement: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'verifiedLevel' ? Number(value) : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, bannerFile: 'Please upload a valid image file.' }));
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        bannerFile: `Image size should be less than ${MAX_IMAGE_SIZE_MB}MB.`,
      }));
      return;
    }

    setErrors((prev) => ({ ...prev, bannerFile: null }));

    const previewUrl = URL.createObjectURL(file);

    setForm((prev) => ({
      ...prev,
      bannerFile: file,
      bannerPreview: previewUrl,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      setErrors({ name: 'Community name is required.' });
      return;
    }

    if (!form.type) {
      setErrors({ type: 'Please select a cause type.' });
      return;
    }

    if (!form.bannerFile) {
      setErrors({ bannerFile: 'Please upload a banner image.' });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('type', form.type);
      formData.append('banner', form.bannerFile);
      formData.append('verifiedLevel', form.verifiedLevel);
      formData.append('locations', form.locations);
      formData.append('foundingDate', form.foundingDate);
      formData.append('affiliatedNGO', form.affiliatedNGO);
      formData.append('missionStatement', form.missionStatement);

      // Await the response and get the created community
      const response = await createCommunity(formData);

      // Redirect to the new community's detail page for instant banner visibility
      navigate(`/communities/${response._id}`);
    } catch (error) {
      alert(error.response?.data?.message || 'Something went wrong');
      console.error(error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6, mb: 8 }}>
      <Paper elevation={8} sx={{
        p: 4,
        borderRadius: 4,
        background: 'linear-gradient(135deg, #f9f4fc 0%, #ede7f6 100%)',
        boxShadow: '0 8px 24px rgba(74, 20, 140, 0.15)',
      }}>
        <Typography variant="h4" align="center" color="#4a148c" fontWeight="bold" gutterBottom sx={{ fontFamily: "'Poppins', sans-serif", mb: 3 }}>
          Create a New Community
        </Typography>
        <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={3}>
          <TextField
            label="Community Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
            sx={{
              '& label.Mui-focused': { color: '#4a148c' },
              '& .MuiOutlinedInput-root.Mui-focused': {
                '& fieldset': { borderColor: '#4a148c' },
              },
            }}
          />
          <TextField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            multiline
            rows={3}
            fullWidth
            sx={{
              '& label.Mui-focused': { color: '#4a148c' },
              '& .MuiOutlinedInput-root.Mui-focused': {
                '& fieldset': { borderColor: '#4a148c' },
              },
            }}
          />
          <FormControl fullWidth required error={!!errors.type}>
            <InputLabel sx={{ color: '#4a148c' }}>Cause Type</InputLabel>
            <Select
              name="type"
              value={form.type}
              onChange={handleChange}
              label="Cause Type"
              sx={{
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#4a148c',
                },
              }}
            >
              {COMMUNITY_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
            {errors.type && (
              <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
                {errors.type}
              </Typography>
            )}
          </FormControl>
          <Box>
            <Typography variant="subtitle1" fontWeight="medium" mb={1} color="#4a148c">
              Upload Banner Image <Typography component="span" color="text.secondary">(Max 5MB)</Typography>
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
                    sx={{ width: 140, height: 90, borderRadius: 3, boxShadow: 3 }}
                  />
                )}
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  Preview of your banner image
                </Typography>
              </Stack>
            </Fade>
          </Box>
          <FormControl fullWidth>
            <InputLabel sx={{ color: '#4a148c' }}>Verified Badge Level</InputLabel>
            <Select
              name="verifiedLevel"
              value={form.verifiedLevel}
              onChange={handleChange}
              label="Verified Badge Level"
              sx={{
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#4a148c',
                },
              }}
            >
              {VERIFIED_LEVELS.map((level) => (
                <MenuItem key={level.value} value={level.value}>
                  {level.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Location(s) Covered"
            name="locations"
            value={form.locations}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Founding Date"
            name="foundingDate"
            type="date"
            value={form.foundingDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            label="Affiliated NGO/Organization"
            name="affiliatedNGO"
            value={form.affiliatedNGO}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Mission Statement"
            name="missionStatement"
            value={form.missionStatement}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
          />
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: '#4a148c',
              '&:hover': { backgroundColor: '#38006b' },
              py: 1.5,
              borderRadius: 3,
              fontWeight: 'bold',
              fontSize: '1rem',
              mt: 2,
              boxShadow: '0 6px 16px rgba(56, 0, 107, 0.5)',
            }}
            disabled={!!errors.bannerFile}
          >
            Create Community
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateCommunityForm;
