import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Divider, Button, Switch, FormControlLabel, TextField, Dialog,
  DialogTitle, DialogContent, DialogActions, Avatar, Paper, Stack
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import UserAPI from '@modules/user/UserAPI';
import axios from '../../shared/axios';
import { Person, Delete, Email, BugReport, Feedback } from '@mui/icons-material';

const SettingsPage = ({ onLogout, onThemeToggle, isDarkMode }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [issue, setIssue] = useState('');
  const [contact, setContact] = useState('');
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    UserAPI.getUser(userId).then(setUser);
  }, []);

  const handleDeleteAccount = async () => {
    try {
      await axios.delete('/auth/me');
      setShowDeleteDialog(false);
      onLogout();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete account');
    }
  };

  const handleFeedbackSubmit = () => {
    setFeedback('');
    alert('Thank you for your feedback!');
  };
  const handleIssueSubmit = () => {
    setIssue('');
    alert('Your issue has been reported!');
  };
  const handleContactSubmit = () => {
    setContact('');
    alert('Support will contact you soon!');
  };

  if (!user) {
    return (
      <Box maxWidth="sm" mx="auto" mt={4} p={2}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 800, color: '#7b1fa2' }}>Settings</Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography>Loading profile...</Typography>
      </Box>
    );
  }

  return (
    <Box
      maxWidth="sm"
      mx="auto"
      mt={4}
      p={{ xs: 1, md: 2 }}
      sx={{
        background: 'linear-gradient(135deg, #f3e5f5 0%, #ce93d8 100%)',
        borderRadius: 4,
        boxShadow: '0 8px 40px rgba(123,31,162,0.08)',
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: 900,
          color: '#7b1fa2',
          letterSpacing: 1,
          textAlign: 'center',
        }}
      >
        Settings
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {/* Profile Section */}
      <Typography variant="subtitle1" sx={{ mt: 2, color: '#7b1fa2', fontWeight: 700, letterSpacing: 1 }}>
        Profile
      </Typography>
      <Paper
        elevation={3}
        onClick={() => navigate('/settings/edit-profile')}
        sx={{
          textAlign: 'center',
          my: 2,
          cursor: 'pointer',
          borderRadius: 3,
          transition: 'background 0.2s, box-shadow 0.2s',
          boxShadow: '0 4px 24px 0 #ce93d8',
          bgcolor: '#fff',
          '&:hover': {
            backgroundColor: '#f3e5f5',
            boxShadow: '0 8px 32px #7b1fa2',
          },
          p: 3,
          userSelect: 'none',
          position: 'relative',
        }}
        role="button"
        tabIndex={0}
        aria-label="Edit profile"
        onKeyPress={e => {
          if (e.key === 'Enter' || e.key === ' ') navigate('/settings/edit-profile');
        }}
      >
        <Avatar
          src={user.avatar || '/assets/default-avatar.png'}
          alt={user.name}
          sx={{
            width: 100,
            height: 100,
            mx: 'auto',
            mb: 1,
            border: '4px solid #ce93d8',
            boxShadow: '0 2px 8px #ba68c8',
            backgroundColor: '#f3e5f5',
          }}
        >
          <Person sx={{ fontSize: 56, color: '#7b1fa2' }} />
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>{user.name}</Typography>
        <Typography color="text.secondary" gutterBottom>
          {user.bio || 'No bio provided.'}
        </Typography>
        {user.interests && user.interests.length > 0 && (
          <Typography variant="body2" color="text.secondary">
            Interests: {user.interests.join(', ')}
          </Typography>
        )}
        <Typography variant="caption" color="#7b1fa2" sx={{ mt: 1, display: 'block', fontWeight: 700 }}>
          Click to edit profile
        </Typography>
      </Paper>

      <Divider sx={{ my: 3 }} />

      {/* Account Management */}
      <Typography variant="subtitle1" sx={{ color: '#7b1fa2', fontWeight: 700, letterSpacing: 1 }}>
        Account Management
      </Typography>
      <Box sx={{ my: 2 }}>
        <Button
          color="error"
          variant="contained"
          startIcon={<Delete />}
          onClick={() => setShowDeleteDialog(true)}
          sx={{
            fontWeight: 700,
            borderRadius: 2,
            px: 3,
            py: 1,
            minWidth: 150,
            boxShadow: '0 2px 8px rgba(211,47,47,0.08)',
            textTransform: 'none',
          }}
        >
          Delete Account
        </Button>
        <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
          <DialogTitle>Delete Account</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete your account? This action cannot be undone.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button color="error" variant="contained" onClick={handleDeleteAccount}>Delete</Button>
          </DialogActions>
        </Dialog>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Help and Support */}
      <Typography variant="subtitle1" sx={{ color: '#7b1fa2', fontWeight: 700, letterSpacing: 1 }}>
        Help & Support
      </Typography>
      <Stack spacing={2} sx={{ my: 2 }}>
        <Box>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <Email sx={{ color: '#7b1fa2' }} />
            <Typography>Contact Support:</Typography>
          </Stack>
          <TextField
            fullWidth
            placeholder="Your email or phone"
            value={contact}
            onChange={e => setContact(e.target.value)}
            sx={{ mb: 1 }}
          />
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#7b1fa2',
              color: '#fff',
              fontWeight: 700,
              borderRadius: 2,
              px: 3,
              py: 1,
              minWidth: 120,
              textTransform: 'none',
              '&:hover': { backgroundColor: '#6a1b9a' }
            }}
            onClick={handleContactSubmit}
          >
            Contact
          </Button>
        </Box>
        <Box>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <BugReport sx={{ color: '#7b1fa2' }} />
            <Typography>Report Technical Issue:</Typography>
          </Stack>
          <TextField
            fullWidth
            placeholder="Describe your issue"
            value={issue}
            onChange={e => setIssue(e.target.value)}
            sx={{ mb: 1 }}
          />
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#7b1fa2',
              color: '#fff',
              fontWeight: 700,
              borderRadius: 2,
              px: 3,
              py: 1,
              minWidth: 120,
              textTransform: 'none',
              '&:hover': { backgroundColor: '#6a1b9a' }
            }}
            onClick={handleIssueSubmit}
          >
            Report Issue
          </Button>
        </Box>
        <Box>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <Feedback sx={{ color: '#7b1fa2' }} />
            <Typography>Submit Feedback:</Typography>
          </Stack>
          <TextField
            fullWidth
            placeholder="Your feedback"
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
            sx={{ mb: 1 }}
          />
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#7b1fa2',
              color: '#fff',
              fontWeight: 700,
              borderRadius: 2,
              px: 3,
              py: 1,
              minWidth: 120,
              textTransform: 'none',
              '&:hover': { backgroundColor: '#6a1b9a' }
            }}
            onClick={handleFeedbackSubmit}
          >
            Submit Feedback
          </Button>
        </Box>
      </Stack>

      <Divider sx={{ my: 3 }} />

      {/* Dark/Light Mode Toggle */}
      <Typography variant="subtitle1" sx={{ color: '#7b1fa2', fontWeight: 700, letterSpacing: 1 }}>
        Appearance
      </Typography>
      <FormControlLabel
        control={
          <Switch
            checked={isDarkMode}
            onChange={onThemeToggle}
            name="darkMode"
            color="secondary"
          />
        }
        label={isDarkMode ? 'Dark Mode' : 'Light Mode'}
        sx={{ ml: 1, mt: 1 }}
      />
    </Box>
  );
};

export default SettingsPage;
