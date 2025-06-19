import React from 'react';
import { Box, Typography } from '@mui/material';

const Logo = ({ size = 48 }) => {
  return (
    <Box display="flex" alignItems="center" gap={1} sx={{ cursor: 'pointer', mb: 3 }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="22" cy="32" r="14" stroke="#4a148c" strokeWidth="4" />
        <circle cx="42" cy="32" r="14" stroke="#4a148c" strokeWidth="4" />
        <circle cx="32" cy="32" r="10" fill="#4a148c" fillOpacity="0.2" />
      </svg>

      <Typography
        variant="h5"
        component="span"
        sx={{
          fontWeight: 'bold',
          color: '#4a148c',
          fontFamily: "'Poppins', sans-serif",
          userSelect: 'none',
        }}
      >
        CommUnity Connect
      </Typography>
    </Box>
  );
};

export default Logo;
