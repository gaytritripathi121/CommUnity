import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';
import UserProfileCard from './UserProfileCard';
import UserAPI from './UserAPI';

const UserProfilePage = ({ userId: propUserId }) => {
  const params = useParams();
  const navigate = useNavigate();
  const userId = propUserId || params.userId;
  const [user, setUser] = useState(null);
  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) return;
    UserAPI.getUser(userId).then(setUser).catch(console.error);
  }, [userId]);

  if (!user) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="sm" sx={{ mt: 4, textAlign: 'center' }}>
      <UserProfileCard user={user} />

      {userId === currentUserId && (
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            onClick={() => navigate('/settings/edit-profile')}
          >
            Edit Profile
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default UserProfilePage;
