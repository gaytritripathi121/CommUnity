import React from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button } from '@mui/material';

const BackButton = ({ label = "Back", to, sx = {}, ...props }) => {
  const navigate = useNavigate();
  return (
    <Button
      variant="outlined"
      startIcon={<ArrowBackIcon />}
      onClick={() => to ? navigate(to) : navigate(-1)}
      sx={{ mb: 2, ...sx }}
      {...props}
    >
      {label}
    </Button>
  );
};

export default BackButton;
    