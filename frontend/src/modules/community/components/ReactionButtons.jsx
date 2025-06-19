import React from 'react';
import { IconButton, Badge, Stack } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import FavoriteIcon from '@mui/icons-material/Favorite';
import axios from '../../../shared/axios';

const ReactionButtons = ({ post, communityId }) => {
  const handleReaction = async (reaction) => {
    try {
      await axios.post(`/communities/${communityId}/posts/${post._id}/reactions`, {
        reaction,
      });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to react');
    }
  };

  return (
    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
      <Badge badgeContent={post.reactions?.like?.length || 0} color="primary">
        <IconButton 
          size="small" 
          onClick={() => handleReaction('like')}
          color={post.reactions?.like?.includes(localStorage.getItem('userId')) ? 'primary' : 'default'}
        >
          <ThumbUpIcon fontSize="small" />
        </IconButton>
      </Badge>

      <Badge badgeContent={post.reactions?.love?.length || 0} color="error">
        <IconButton 
          size="small" 
          onClick={() => handleReaction('love')}
          color={post.reactions?.love?.includes(localStorage.getItem('userId')) ? 'error' : 'default'}
        >
          <FavoriteIcon fontSize="small" />
        </IconButton>
      </Badge>
    </Stack>
  );
};

export default ReactionButtons;
