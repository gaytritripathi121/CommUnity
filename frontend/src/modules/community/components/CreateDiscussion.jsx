import React, { useState } from 'react';
import { TextField, Button, Box, Fade } from '@mui/material';
import axios from '../../../shared/axios';

const CreateDiscussion = ({ communityId, onDiscussionCreated }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    try {
      await axios.post(`/communities/${communityId}/posts`, {
        content,
        type: 'discussion',
      });
      setContent('');
      if (onDiscussionCreated) onDiscussionCreated();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to post discussion');
    }
    setLoading(false);
  };

  return (
    <Fade in>
      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3, maxWidth: 700 }}>
        <TextField
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Start a discussion..."
          label="Discussion"
          fullWidth
          multiline
          minRows={3}
          required
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              backgroundColor: '#f3e5f5',
            },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          size="medium"
          disabled={loading || !content.trim()}
          sx={{
            fontWeight: 700,
            textTransform: 'none',
            borderRadius: 2,
            px: 4,
            py: 1.5,
            minWidth: 120,
            minHeight: 38,
            letterSpacing: 0.5,
            backgroundColor: '#7b1fa2',
            color: '#fff',
            boxShadow: '0 2px 8px rgba(123,31,162,0.13)',
            '&:hover': {
              backgroundColor: '#6a1b9a',
              boxShadow: '0 4px 16px rgba(123,31,162,0.18)',
            },
          }}
        >
          {loading ? 'Posting...' : 'Discuss'}
        </Button>
      </Box>
    </Fade>
  );
};

export default CreateDiscussion;
