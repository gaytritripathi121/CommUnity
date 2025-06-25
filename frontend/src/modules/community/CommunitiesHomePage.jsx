import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { COMMUNITY_TYPES } from '@shared/constants';
import GroupIcon from '@mui/icons-material/Group';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';


const typeIcons = {
  Social: <GroupIcon fontSize="large" sx={{ color: '#4a148c' }} />,
  Environmental: <Diversity3Icon fontSize="large" sx={{ color: '#4a148c' }} />,
  Charity: <EmojiPeopleIcon fontSize="large" sx={{ color: '#4a148c' }} />,
 
};

const CommunitiesHomePage = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (type) => {
    const formattedType = encodeURIComponent(type);
    navigate(`/communities/category/${formattedType}`);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: 6,
        px: { xs: 2, md: 6 },
        background: 'linear-gradient(135deg, #f3e5f5 0%, #ede7f6 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Header */}
      <Box textAlign="center" mb={6} maxWidth={700}>
        <Typography
          variant="h3"
          fontWeight="bold"
          color="#4a148c"
          gutterBottom
          sx={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Explore Communities
        </Typography>
        <Typography variant="h6" color="#7b1fa2" sx={{ fontWeight: 500 }}>
          Discover and join communities that inspire you. Connect, share, and grow together!
        </Typography>
      </Box>

      {/* Categories Grid */}
      <Grid container spacing={4} maxWidth="lg" justifyContent="center" sx={{ width: '100%' }}>
        {COMMUNITY_TYPES.map((type) => (
          <Grid item xs={12} sm={6} md={4} key={type}>
            <Paper
              elevation={6}
              onClick={() => handleCategoryClick(type)}
              sx={{
                cursor: 'pointer',
                borderRadius: 4,
                p: 4,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                backgroundColor: 'white',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-10px)',
                  boxShadow: '0 12px 24px rgba(74, 20, 140, 0.3)',
                  backgroundColor: '#f3e5f5',
                },
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') handleCategoryClick(type); }}
            >
              <Box mb={2}>
                {typeIcons[type] || (
                  <GroupIcon fontSize="large" sx={{ color: '#4a148c' }} />
                )}
              </Box>
              <Typography variant="h5" fontWeight="bold" color="#4a148c" gutterBottom>
                {type}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ px: 1 }}>
                {/* Optional: Add a short description per type here */}
                Join communities focused on {type.toLowerCase()} causes and activities.
              </Typography>
            </Paper>
          </Grid>
        ))}

        {/* Create New Community Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            elevation={6}
            onClick={() => navigate('/communities/create')}
            sx={{
              cursor: 'pointer',
              borderRadius: 4,
              p: 4,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              backgroundColor: '#4a148c',
              color: 'white',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-10px)',
                boxShadow: '0 12px 24px rgba(74, 20, 140, 0.6)',
                backgroundColor: '#38006b',
              },
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') navigate('/communities/create'); }}
          >
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              + Create New Community
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Start your own community and bring people together!
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CommunitiesHomePage;
