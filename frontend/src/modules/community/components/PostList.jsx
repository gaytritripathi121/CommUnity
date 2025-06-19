import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Pagination,
  Stack,
  Chip,
  Box,
  Divider,
} from '@mui/material';
import axios from '../../../shared/axios';
import ReactionButtons from './ReactionButtons';
import PostActions from './PostActions';
import ReplyForm from './ReplyForm';
import CreatePost from './CreatePost';

const PostList = ({ communityId, type, isAdmin }) => {
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    axios
      .get(`/communities/${communityId}/posts?type=${type}&page=${page}&limit=10`)
      .then((res) => {
        setPosts(res.data.posts);
        setTotalPages(res.data.pages);
      })
      .catch(() => {
        // handle errors gracefully
      });
  }, [communityId, type, page, refresh]);

  const handlePostCreated = () => {
    setRefresh((r) => r + 1);
    setPage(1);
  };

  return (
    <Stack spacing={3}>
      {/* Admin-only post box */}
      <CreatePost communityId={communityId} onPostCreated={handlePostCreated} isAdmin={isAdmin} />

      {posts.map((post) => (
        <Card
          key={post._id}
          sx={{
            borderLeft: post.pinned ? '6px solid #fbc02d' : 'none',
            boxShadow: '0 4px 20px rgba(156, 39, 176, 0.15)',
            borderRadius: 3,
            position: 'relative',
            background: post.pinned
              ? 'linear-gradient(90deg, #fffde7 0%, #fff9c4 100%)'
              : 'white',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'scale(1.02)',
              boxShadow: '0 8px 30px rgba(156, 39, 176, 0.3)',
            },
          }}
        >
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold" color="#6a1b9a">
                {post.author.name}
              </Typography>
              {post.pinned && <Chip label="Pinned" size="small" color="warning" />}
              <Box sx={{ marginLeft: 'auto' }}>
                <PostActions post={post} communityId={communityId} isAdmin={isAdmin} onUpdate={handlePostCreated} />
              </Box>
            </Stack>

            <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line', fontSize: '1.05rem' }}>
              {post.content}
            </Typography>

            <ReactionButtons post={post} communityId={communityId} />

            <Divider sx={{ my: 2 }} />

            <ReplyForm postId={post._id} communityId={communityId} onReply={handlePostCreated} />
          </CardContent>
        </Card>
      ))}

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="secondary"
          shape="rounded"
          size="large"
          siblingCount={1}
          boundaryCount={1}
          showFirstButton
          showLastButton
          sx={{
            '& .MuiPaginationItem-root': {
              fontWeight: 'bold',
              color: '#6a1b9a',
            },
            '& .Mui-selected': {
              backgroundColor: '#9c27b0',
              color: 'white',
              '&:hover': {
                backgroundColor: '#7b1fa2',
              },
            },
          }}
        />
      </Box>
    </Stack>
  );
};

export default PostList;
