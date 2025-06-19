import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, CircularProgress, Fade } from '@mui/material';
import UserProfileCard from './UserProfileCard';
import UserAPI from './UserAPI';

const UserProfilePage = ({ userId: propUserId }) => {
  const params = useParams();
  const userId = propUserId || params.userId;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    UserAPI.getUser(userId)
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userId]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(120deg, #ede7f6 0%, #fff 100%)',
        py: 8,
      }}
    >
      <Container maxWidth="sm">
        {loading ? (
          <Fade in={loading}>
            <Box sx={{ textAlign: 'center', mt: 10 }}>
              <CircularProgress color="secondary" />
              <Typography sx={{ mt: 2 }} color="text.secondary">
                Loading profile...
              </Typography>
            </Box>
          </Fade>
        ) : !user ? (
          <Fade in={!loading}>
            <Box sx={{ textAlign: 'center', mt: 10 }}>
              <Typography color="error" variant="h6">
                User not found.
              </Typography>
            </Box>
          </Fade>
        ) : (
          <Fade in={!loading}>
            <Box>
              <UserProfileCard user={user} isCurrentUser={userId === currentUserId} />
            </Box>
          </Fade>
        )}
      </Container>
    </Box>
  );
};

export default UserProfilePage;
