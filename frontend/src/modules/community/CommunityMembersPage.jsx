import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Snackbar,
  Button,
  Paper,
  Skeleton,
  Stack,
  Fade
} from '@mui/material';
import MemberList from './components/MemberList'; // Adjust path if needed
import axios from '../../shared/axios';
import GroupIcon from '@mui/icons-material/Group';

const CommunityMembersPage = () => {
  const { id } = useParams();
  const [community, setCommunity] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const currentUserId = localStorage.getItem('userId');
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchCommunity = () => {
    axios.get(`/communities/${id}`).then(res => {
      setCommunity(res.data);
      setIsAdmin(
        Array.isArray(res.data.admins) &&
        res.data.admins.some(a => (a._id || a).toString() === currentUserId)
      );
    });
  };

  useEffect(() => {
    fetchCommunity();
    // eslint-disable-next-line
  }, [id, currentUserId]);

  const handlePromote = async (userId) => {
    try {
      await axios.put(`/communities/${id}/members/${userId}/promote`);
      setSnackbar({ open: true, message: 'User promoted to admin!' });
      fetchCommunity();
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || 'Failed to promote' });
    }
  };

  if (!community)
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', py: 6 }}>
        <Skeleton variant="rectangular" width="100%" height={80} sx={{ mb: 2, borderRadius: 2 }} />
        <Stack spacing={2}>
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} variant="rounded" height={64} />
          ))}
        </Stack>
      </Box>
    );

  return (
    <Fade in>
      <Box
        sx={{
          maxWidth: 600,
          mx: 'auto',
          py: 6,
          px: { xs: 1, sm: 3 },
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f3e5f5 0%, #ce93d8 100%)',
          borderRadius: 6,
          boxShadow: '0 8px 40px rgba(156,39,176,0.11)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            mb: 4,
            p: 3,
            borderRadius: 4,
            background: 'linear-gradient(90deg, #7b1fa2 0%, #ce93d8 100%)',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            boxShadow: '0 4px 16px rgba(123,31,162,0.13)',
            width: '100%',
            maxWidth: 500,
          }}
        >
          <GroupIcon fontSize="large" sx={{ color: '#fff' }} />
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 900,
                letterSpacing: 1,
                color: '#fff',
                textShadow: '0 2px 12px #7b1fa2'
              }}
            >
              {community.name}
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ color: '#ede7f6', fontWeight: 500 }}
            >
              Members List
            </Typography>
          </Box>
        </Paper>

        <Box sx={{ width: '100%', maxWidth: 500 }}>
          <MemberList
            members={community.members}
            admins={community.admins}
            currentUserId={currentUserId}
            onPromote={handlePromote}
          />
        </Box>

        {isAdmin && (
          <Box sx={{ mt: 5, textAlign: 'center', width: '100%' }}>
            <Button
              component={Link}
              to={`/communities/${id}/settings`}
              variant="contained"
              color="secondary"
              sx={{
                fontWeight: 700,
                letterSpacing: 1,
                borderRadius: 2,
                px: 4,
                py: 1.5,
                background: 'linear-gradient(90deg, #7b1fa2 0%, #ce93d8 100%)',
                color: '#fff',
                boxShadow: '0 4px 16px #ba68c8',
                '&:hover': {
                  background: 'linear-gradient(90deg, #ce93d8 0%, #7b1fa2 100%)'
                }
              }}
            >
              Edit Community Settings
            </Button>
          </Box>
        )}

        <Snackbar
          open={snackbar.open}
          message={snackbar.message}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ open: false, message: '' })}
        />
      </Box>
    </Fade>
  );
};

export default CommunityMembersPage;
