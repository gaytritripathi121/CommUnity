import React, { useState } from 'react';
import { TextField, Button, Stack, Box } from '@mui/material';
import axios from '../../../shared/axios';

const ReplyForm = ({ postId, communityId, onReply }) => {
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
        parent: postId,
      });
      setContent('');
      if (onReply) onReply();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to post reply');
    }
    setLoading(false);
  };

  return (
    <Box sx={{ mt: 2, pl: 4, maxWidth: 600 }}>
      <form onSubmit={handleSubmit}>
        <Stack spacing={1}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Write a reply..."
            multiline
            rows={2}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: '#f3e5f5',
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            size="small"
            disabled={loading || !content.trim()}
            sx={{
              alignSelf: 'flex-end',
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: 2,
              px: 3,
              py: 1,
              minWidth: 110,
              minHeight: 38,
              letterSpacing: 0.5,
              backgroundColor: '#7b1fa2',
              color: '#fff',
              boxShadow: '0 2px 8px rgba(123,31,162,0.3)',
              '&:hover': {
                backgroundColor: '#6a1b9a',
                boxShadow: '0 4px 16px rgba(123,31,162,0.5)',
              },
            }}
          >
            {loading ? 'Posting...' : 'Reply'}
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default ReplyForm;
