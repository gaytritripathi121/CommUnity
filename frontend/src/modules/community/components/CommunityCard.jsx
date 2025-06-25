import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActionArea,
  Box,
  Chip,
  Stack,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CommunityCard = ({ community }) => {
  const navigate = useNavigate();
  const { _id, name, banner, missionStatement } = community;

  const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
  let bannerUrl = '/default-banner.png';
  if (banner) {
    if (banner.startsWith('http')) {
      bannerUrl = banner;
    } else if (banner.startsWith('/')) {
      bannerUrl = `${backendUrl}${banner}`;
    } else {
      bannerUrl = `${backendUrl}/uploads/${banner}`;
    }
  }

  return (
    <Card
      sx={{
        height: 340,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 4,
        boxShadow: '0 8px 32px rgba(74, 20, 140, 0.18)',
        background: 'linear-gradient(135deg, #ede7f6 0%, #fff 100%)',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'scale(1.03) translateY(-8px)',
          boxShadow: '0 16px 40px rgba(74, 20, 140, 0.28)',
        },
        overflow: 'hidden',
        position: 'relative',
      }}
      elevation={6}
    >
      <CardActionArea onClick={() => navigate(`/communities/${_id}`)} sx={{ flexGrow: 1 }}>
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="160"
            image={bannerUrl}
            alt={`${name} banner`}
            sx={{
              objectFit: 'cover',
              width: '100%',
              filter: 'brightness(0.92) saturate(1.1)',
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              transition: 'filter 0.3s',
              '&:hover': { filter: 'brightness(1) saturate(1.2)' },
            }}
          />
          <Chip
            label="Featured"
            color="secondary"
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              background: 'rgba(123, 31, 162, 0.85)',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: 13,
              letterSpacing: 0.5,
              boxShadow: '0 2px 8px rgba(123, 31, 162, 0.18)',
            }}
          />
        </Box>
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: '#4a148c',
              fontFamily: "'Poppins', sans-serif",
              letterSpacing: 0.5,
              mb: 1,
            }}
          >
            {name}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              minHeight: 60,
              fontSize: 15,
              fontStyle: 'italic',
              mb: 2,
            }}
          >
            {missionStatement || 'No mission statement provided.'}
          </Typography>
          <Stack direction="row" spacing={1}>
            <Chip label="Active" color="success" size="small" />
           
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default CommunityCard;
