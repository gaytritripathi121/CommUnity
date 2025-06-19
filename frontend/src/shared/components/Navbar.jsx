import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ isLoggedIn, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate('/login');
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: '#4a148c', // Deep purple to match buttons
        boxShadow: 'none',
      }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          CommUnity Connect
        </Typography>
        {!isLoggedIn && (
          <>
            <Button
              component={Link}
              to="/login"
              sx={{
                color: 'white',
                textTransform: 'none',
                fontWeight: 'medium',
                '&:hover': { backgroundColor: '#38006b' },
                mr: 1,
              }}
            >
              Login
            </Button>
            <Button
              component={Link}
              to="/register"
              sx={{
                color: 'white',
                textTransform: 'none',
                fontWeight: 'medium',
                '&:hover': { backgroundColor: '#38006b' },
              }}
            >
              Register
            </Button>
          </>
        )}
        {isLoggedIn && (
          <>
            <Button
              component={Link}
              to="/settings"
              sx={{
                color: 'white',
                textTransform: 'none',
                fontWeight: 'medium',
                '&:hover': { backgroundColor: '#38006b' },
                mr: 1,
              }}
            >
              Settings
            </Button>
            <Button
              onClick={handleLogout}
              sx={{
                color: 'white',
                textTransform: 'none',
                fontWeight: 'medium',
                '&:hover': { backgroundColor: '#38006b' },
              }}
            >
              Logout
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
