import React from 'react';
import { Avatar, Typography, Box, Chip, Stack } from '@mui/material';

const UserProfileCard = ({ user }) => {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Avatar
        src={user.avatar || '/assets/default-avatar.png'}
        alt={user.name}
        sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
      />
      <Typography variant="h5">{user.name}</Typography>
      <Typography variant="subtitle1" color="text.secondary">@{user.username}</Typography>
      <Typography variant="body1" sx={{ mt: 2, mb: 2 }}>
        {user.bio || 'No bio provided.'}
      </Typography>

      {user.interests && user.interests.length > 0 && (
        <>
          <Typography variant="subtitle2" gutterBottom>Interests:</Typography>
          <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
            {user.interests.map((interest) => (
              <Chip key={interest} label={interest} />
            ))}
          </Stack>
        </>
      )}
    </Box>
  );
};

export default UserProfileCard;
