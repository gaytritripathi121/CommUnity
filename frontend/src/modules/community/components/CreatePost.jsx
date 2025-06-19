import React, { useState } from 'react';
import { TextField, Button, Box, Paper, Stack, Typography, IconButton } from '@mui/material';
import axios from '../../../shared/axios';
import CloseIcon from '@mui/icons-material/Close';

const CreatePost = ({ communityId, onPostCreated, isAdmin }) => {
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);

  if (!isAdmin) return null;

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Only prevent if both fields are empty
    if (!content.trim() && attachments.length === 0) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('content', content);
      formData.append('type', 'main');
      attachments.forEach(file => formData.append('attachments', file));

      console.log([...formData.entries()]);


      // Do NOT set Content-Type header manually; axios will handle it
      await axios.post(`/communities/${communityId}/posts`, formData);

      setContent('');
      setAttachments([]);
      if (onPostCreated) onPostCreated();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to post');
    }
    setLoading(false);
  };

  return (
    <Paper elevation={6} sx={{ p: 3, borderRadius: 3, background: 'linear-gradient(135deg, #ce93d8 0%, #ba68c8 100%)' }}>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Write an event or information..."
          label="Event or Info"
          fullWidth
          multiline
          minRows={3}
          sx={{ mb: 2, backgroundColor: 'white', borderRadius: 1 }}
        />

        <Button variant="outlined" component="label" sx={{ mb: 2, color: '#6a1b9a', borderColor: '#6a1b9a' }}>
          Attach Files
          <input type="file" hidden multiple accept="image/*,.pdf,.doc,.docx,.txt" onChange={handleFileChange} />
        </Button>

        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
          {attachments.map((file, idx) => (
            <Box
              key={idx}
              sx={{
                position: 'relative',
                bgcolor: '#f3e5f5',
                px: 1.5,
                py: 0.5,
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(156, 39, 176, 0.3)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Typography variant="caption" sx={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {file.name}
              </Typography>
              <IconButton size="small" onClick={() => removeAttachment(idx)} sx={{ ml: 0.5, color: '#6a1b9a' }} aria-label="Remove attachment">
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Stack>

        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{ backgroundColor: '#7b1fa2', '&:hover': { backgroundColor: '#6a1b9a' }, fontWeight: 'bold', boxShadow: '0 4px 15px rgba(123, 31, 162, 0.6)' }}
          fullWidth
        >
          {loading ? 'Posting...' : 'Post'}
        </Button>
      </Box>
    </Paper>
  );
};

export default CreatePost;
