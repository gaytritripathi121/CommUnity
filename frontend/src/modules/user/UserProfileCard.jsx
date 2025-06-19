import React from 'react';
import {
  Avatar,
  Typography,
  Box,
  Chip,
  Stack,
  Button,
  Snackbar,
  Alert,
  Paper,
  Divider,
  Tooltip
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import StarIcon from '@mui/icons-material/Star';
import EditIcon from '@mui/icons-material/Edit';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import BlockIcon from '@mui/icons-material/Block';
import UserAPI from './UserAPI';

const UserProfileCard = ({ user, isCurrentUser }) => {
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });

  const handleBlock = async () => {
    try {
      await UserAPI.blockUser(user._id);
      setSnackbar({ open: true, message: 'User blocked.', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Failed to block user.', severity: 'error' });
    }
  };

  return (
    <Paper
      elevation={6}
      sx={{
        maxWidth: 500,
        mx: 'auto',
        p: 4,
        borderRadius: 4,
        background: 'linear-gradient(135deg, #ede7f6 0%, #fff 100%)',
        boxShadow: '0 4px 24px 0 rgba(123,31,162,0.12)',
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <Avatar
          src={user.avatar || '/assets/default-avatar.png'}
          alt={user.name}
          sx={{
            width: 120,
            height: 120,
            mx: 'auto',
            mb: 2,
            boxShadow: 4,
            border: '4px solid #fff',
            backgroundColor: '#7b1fa2',
            fontSize: 48,
          }}
        >
          {user.name?.[0]}
        </Avatar>
        <Typography variant="h4" fontWeight="bold" sx={{ color: '#4a148c' }}>
          {user.name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
          @{user.username}
        </Typography>
        {user.badges && user.badges.length > 0 && (
          <Stack direction="row" spacing={1} justifyContent="center" mb={1}>
            {user.badges.map((badge, i) => (
              <Tooltip title={badge} key={i}>
                <StarIcon sx={{ color: '#ffd700' }} />
              </Tooltip>
            ))}
          </Stack>
        )}
        <Divider sx={{ my: 2 }} />
        <Typography variant="body1" sx={{ mb: 2, color: '#333' }}>
          {user.bio || <span style={{ color: '#999' }}>No bio provided.</span>}
        </Typography>
        {user.interests && user.interests.length > 0 && (
          <>
            <Typography variant="subtitle2" gutterBottom sx={{ color: '#7b1fa2' }}>
              Interests
            </Typography>
            <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" mb={2}>
              {user.interests.map((interest) => (
                <Chip
                  key={interest}
                  label={interest}
                  sx={{
                    bgcolor: '#ede7f6',
                    color: '#4a148c',
                    fontWeight: 'bold',
                    borderRadius: 2,
                  }}
                />
              ))}
            </Stack>
          </>
        )}
        <Divider sx={{ my: 2 }} />
        <Stack direction="row" spacing={2} justifyContent="center" mt={3}>
          {!isCurrentUser && (
            <>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to={`/chat/${user._id}`}
                startIcon={<ChatBubbleOutlineIcon />}
                sx={{
                  fontWeight: 'bold',
                  borderRadius: 2,
                  px: 3,
                  boxShadow: 2,
                  background: 'linear-gradient(90deg, #7b1fa2 60%, #ce93d8 100%)',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #6a1b9a 60%, #b39ddb 100%)',
                  },
                }}
              >
                Chat
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={handleBlock}
                startIcon={<BlockIcon />}
                sx={{
                  fontWeight: 'bold',
                  borderRadius: 2,
                  px: 3,
                  borderWidth: 2,
                  background: '#fff',
                  '&:hover': {
                    background: '#ffebee',
                  },
                }}
              >
                Block
              </Button>
            </>
          )}
          {isCurrentUser && (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate('/settings/edit-profile')}
              startIcon={<EditIcon />}
              sx={{
                fontWeight: 'bold',
                borderRadius: 2,
                px: 3,
                background: 'linear-gradient(90deg, #7b1fa2 60%, #ce93d8 100%)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #6a1b9a 60%, #b39ddb 100%)',
                },
              }}
            >
              Edit Profile
            </Button>
          )}
        </Stack>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default UserProfileCard;
