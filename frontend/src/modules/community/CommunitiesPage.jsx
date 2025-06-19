import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCommunities } from './communitySlice';
import CommunityCard from './components/CommunityCard';
import Loader from '../../shared/components/Loader';
import { Grid, Box, Typography } from '@mui/material';

const CommunitiesPage = () => {
  const dispatch = useDispatch();
  const { communities, loading, error } = useSelector(state => state.community);

  useEffect(() => {
    dispatch(fetchCommunities());
  }, [dispatch]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '80vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Loader />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', mt: 6 }}>
        <Typography variant="h6" color="error">
          {error || 'Failed to load communities.'}
        </Typography>
      </Box>
    );
  }

  if (!Array.isArray(communities) || communities.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', mt: 6 }}>
        <Typography variant="h6" color="text.secondary">
          No communities found. Try creating one!
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        py: 6,
        px: { xs: 2, sm: 4, md: 6 },
        maxWidth: '1200px',
        mx: 'auto',
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        color="#4a148c"
        gutterBottom
        sx={{ fontFamily: "'Poppins', sans-serif", mb: 4, textAlign: 'center' }}
      >
        All Communities
      </Typography>

      <Grid container spacing={4}>
        {communities.map((comm) => (
          <Grid item xs={12} sm={6} md={4} key={comm._id}>
            <CommunityCard community={comm} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CommunitiesPage;
