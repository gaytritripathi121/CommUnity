import React, { useState, useEffect } from 'react';
import BackButton from './components/BackButton';
import {
  Container,
  Typography,
  Tabs,
  Tab,
  Box,
  Snackbar,
  Button,
  Paper,
  Divider,
} from '@mui/material';
import { Link } from 'react-router-dom';
import JoinButton from './components/JoinButton';
import PostList from './components/PostList';
import CreatePost from './components/CreatePost';
import CreateDiscussion from './components/CreateDiscussion';
import DiscussionList from './components/DiscussionList';
import axios from '../../shared/axios';

const CommunityDetail = ({ communityId }) => {
  const [community, setCommunity] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [refreshPosts, setRefreshPosts] = useState(0);
  const [refreshDiscussions, setRefreshDiscussions] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const currentUserId = localStorage.getItem('userId');

  const fetchCommunity = () => {
    axios.get(`/communities/${communityId}`)
      .then(res => {
        setCommunity(res.data);
        setIsMember(
          Array.isArray(res.data.members) &&
          res.data.members.some(m => (m._id || m).toString() === currentUserId)
        );
        setIsAdmin(
          Array.isArray(res.data.admins) &&
          res.data.admins.some(a => (a._id || a).toString() === currentUserId)
        );
      })
      .catch(() => {
        setSnackbar({ open: true, message: 'Failed to load community data.' });
      });
  };

  useEffect(() => {
    fetchCommunity();
    // eslint-disable-next-line
  }, [communityId]);

  const handleTabChange = (event, newValue) => setTabValue(newValue);

  if (!community) {
    return (
      <Box sx={{ p: 6, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">Loading community...</Typography>
      </Box>
    );
  }

  const categoryRoute = `/communities/category/${encodeURIComponent(community.type)}`;

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <BackButton label="Back to Category" to={categoryRoute} sx={{ mb: 3 }} />

      <Paper
        elevation={8}
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          mb: 5,
          position: 'relative',
          minHeight: 200,
          background: community.banner
            ? `linear-gradient(to bottom, rgba(74, 20, 140, 0.6), rgba(74, 20, 140, 0.9)), url(${community.banner}) center/cover no-repeat`
            : 'linear-gradient(135deg, #7b1fa2 0%, #9c27b0 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'flex-end',
          px: 5,
          pb: 4,
          boxShadow: '0 16px 40px rgba(74, 20, 140, 0.5)',
        }}
      >
        <Box>
          <Typography variant="h3" fontWeight="bold" sx={{ textShadow: '0 3px 8px rgba(0,0,0,0.7)' }}>
            {community.name}
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.9, maxWidth: 650, mt: 1, textShadow: '0 1px 5px rgba(0,0,0,0.6)' }}>
            {community.description || 'No description provided.'}
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Link to={`/communities/${community._id}/members`} style={{ textDecoration: 'none' }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#ce93d8',
                  color: '#4a148c',
                  fontWeight: 'bold',
                  '&:hover': { backgroundColor: '#ab47bc' },
                  boxShadow: '0 4px 12px rgba(156, 39, 176, 0.5)',
                }}
              >
                View Members ({community.members?.length || 0})
              </Button>
            </Link>
          </Box>
        </Box>
      </Paper>

      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <JoinButton
          communityId={communityId}
          isMember={isMember}
          onJoin={() => setIsMember(true)}
          sx={{
            minWidth: 200,
            fontWeight: 'bold',
            fontSize: '1.1rem',
            background: 'linear-gradient(45deg, #7b1fa2 30%, #9c27b0 90%)',
            color: 'white',
            boxShadow: '0 6px 20px rgba(156, 39, 176, 0.6)',
            '&:hover': {
              background: 'linear-gradient(45deg, #9c27b0 30%, #7b1fa2 90%)',
              boxShadow: '0 8px 24px rgba(123, 31, 162, 0.8)',
            },
          }}
        />
      </Box>

      <Paper elevation={4} sx={{ borderRadius: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="secondary"
          textColor="secondary"
          variant="fullWidth"
          sx={{
            borderRadius: 3,
            backgroundColor: '#f3e5f5',
            '& .MuiTab-root': { fontWeight: 'bold', fontSize: '1.1rem' },
            '& .Mui-selected': {
              color: '#6a1b9a',
              backgroundColor: '#e1bee7',
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(123, 31, 162, 0.3)',
            },
          }}
        >
          <Tab label="Events & Info" />
          <Tab label="Discussions" />
        </Tabs>

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ p: 3, minHeight: 420, backgroundColor: '#fafafa' }}>
          {tabValue === 0 && (
            <>
              {isAdmin && (
                <Box sx={{ mb: 4 }}>
                  <CreatePost
                    communityId={communityId}
                    onPostCreated={() => setRefreshPosts(v => v + 1)}
                    sx={{
                      boxShadow: '0 8px 24px rgba(156, 39, 176, 0.15)',
                      borderRadius: 3,
                      backgroundColor: 'white',
                      p: 3,
                    }}
                  />
                </Box>
              )}
              <PostList
                communityId={communityId}
                type="main"
                isAdmin={isAdmin}
                refresh={refreshPosts}
                sx={{
                  borderRadius: 3,
                  boxShadow: '0 6px 20px rgba(123, 31, 162, 0.1)',
                  backgroundColor: 'white',
                  p: 2,
                }}
              />
            </>
          )}

          {tabValue === 1 && (
            <>
              {isMember ? (
                <Box sx={{ mb: 4 }}>
                  <CreateDiscussion
                    communityId={communityId}
                    onDiscussionCreated={() => setRefreshDiscussions(v => v + 1)}
                    sx={{
                      boxShadow: '0 8px 24px rgba(156, 39, 176, 0.15)',
                      borderRadius: 3,
                      backgroundColor: 'white',
                      p: 3,
                    }}
                  />
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontStyle: 'italic' }}>
                  Join the community to participate in discussions.
                </Typography>
              )}
              <DiscussionList
                communityId={communityId}
                refresh={refreshDiscussions}
                sx={{
                  borderRadius: 3,
                  boxShadow: '0 6px 20px rgba(123, 31, 162, 0.1)',
                  backgroundColor: 'white',
                  p: 2,
                }}
              />
            </>
          )}
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ open: false, message: '' })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Container>
  );
};

export default CommunityDetail;
