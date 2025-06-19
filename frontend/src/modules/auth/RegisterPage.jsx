import React from 'react';
import AuthForm from './components/AuthForm';
import Logo from './components/Logo';
import { Box, Typography } from '@mui/material';

const RegisterPage = () => {
  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      sx={{
        background: 'linear-gradient(to right, #ede7f6, #b39ddb)',
      }}
    >
      <Box flexGrow={1} display="flex" flexDirection="column" justifyContent="center" alignItems="center" px={2}>
        <Logo size={56} />
        <AuthForm isLogin={false} />
      </Box>

      <Box component="footer" py={2} textAlign="center" bgcolor="#4a148c" color="white">
        <Typography variant="body2">© 2025 CommUnity Connect. All rights reserved.</Typography>
      </Box>
    </Box>
  );
};

export default RegisterPage;
