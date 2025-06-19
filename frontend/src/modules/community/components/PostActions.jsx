import React from 'react';
import { IconButton, Tooltip, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PushPinIcon from '@mui/icons-material/PushPin';
import axios from '../../../shared/axios';

const PostActions = ({ post, communityId, isAdmin, onUpdate }) => {
  const userId = localStorage.getItem('userId');

  const handleDelete = async () => {
    if (window.confirm('Delete this post?')) {
      try {
        await axios.delete(`/communities/${communityId}/posts/${post._id}`);
        onUpdate();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete');
      }
    }
  };

  const handlePin = async () => {
    try {
      await axios.put(`/communities/${communityId}/posts/${post._id}`, {
        pinned: !post.pinned,
      });
      onUpdate();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to pin/unpin');
    }
  };

  return (
    <Stack direction="row" spacing={1}>
      {(post.author._id === userId || isAdmin) && (
        <>
          <Tooltip title="Delete post">
            <IconButton size="small" color="error" onClick={handleDelete}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={post.pinned ? 'Unpin post' : 'Pin post'}>
            <IconButton
              size="small"
              onClick={handlePin}
              sx={{
                color: post.pinned ? '#fbc02d' : 'inherit',
                transition: 'color 0.3s',
                '&:hover': {
                  color: post.pinned ? '#f9a825' : '#7b1fa2',
                },
              }}
            >
              <PushPinIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      )}
    </Stack>
  );
};

export default PostActions;
