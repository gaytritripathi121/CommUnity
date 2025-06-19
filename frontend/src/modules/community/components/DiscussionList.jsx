import React, { useEffect, useState } from 'react';
import axios from '../../../shared/axios';
import { Link } from 'react-router-dom';
import ReplyForm from './ReplyForm';
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  Fade
} from '@mui/material';

// Build tree from flat posts array
function buildTree(posts) {
  const map = {};
  posts.forEach(post => { map[post._id] = { ...post, children: [] }; });
  const tree = [];
  posts.forEach(post => {
    if (post.parent && map[post.parent]) {
      map[post.parent].children.push(map[post._id]);
    } else if (post.type === 'discussion') {
      tree.push(map[post._id]);
    }
  });
  return { tree, map };
}

const currentUserId = localStorage.getItem('userId');

const CommentNode = ({ node, communityId, onReply, parentMap }) => {
  if (!node) return null;

  const [showReplyForm, setShowReplyForm] = useState(false);

  const parent =
    node.parent && parentMap && parentMap[node.parent]
      ? parentMap[node.parent]
      : null;

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post and all its replies?')) {
      try {
        await axios.delete(`/communities/${communityId}/posts/${node._id}`);
        onReply();
      } catch {
        alert('Failed to delete post');
      }
    }
  };

  return (
    <Box
      sx={{
        ml: node.parent ? 5 : 0,
        mt: 3,
        p: 3,
        borderRadius: 3,
        bgcolor: node.parent ? '#f3e5f5' : '#e1bee7',
        boxShadow: node.parent ? 'none' : '0 4px 12px rgba(123,31,162,0.1)',
        transition: 'background-color 0.3s',
        '&:hover': { bgcolor: '#d1c4e9' },
      }}
    >
      {parent && (
        <Paper
          elevation={0}
          sx={{
            bgcolor: '#ce93d8',
            color: '#4a148c',
            borderLeft: '6px solid #7b1fa2',
            p: 1,
            mb: 1,
            borderRadius: 1,
            fontStyle: 'italic',
            fontSize: '0.9rem',
            userSelect: 'none',
          }}
        >
          Replying to <strong>{parent.author?.name || 'Unknown'}</strong>:&nbsp;
          {parent.content?.length > 80 ? parent.content.slice(0, 80) + '...' : parent.content}
        </Paper>
      )}

      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <Typography
          variant="subtitle2"
          component={Link}
          to={`/users/${node.author._id}`}
          sx={{
            color: '#7b1fa2',
            fontWeight: 'bold',
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          {node.author.name}
        </Typography>
        <Typography variant="body1" sx={{ flexGrow: 1 }}>
          {node.content}
        </Typography>
        <Button
          size="small"
          variant="contained"
          onClick={() => setShowReplyForm(v => !v)}
          sx={{
            fontWeight: 700,
            textTransform: 'none',
            borderRadius: 2,
            px: 2.5,
            py: 0.5,
            minWidth: 90,
            minHeight: 32,
            letterSpacing: 0.5,
            backgroundColor: '#7b1fa2',
            color: '#fff',
            boxShadow: '0 2px 8px rgba(123,31,162,0.13)',
            '&:hover': {
              backgroundColor: '#6a1b9a',
              boxShadow: '0 4px 16px rgba(123,31,162,0.18)',
            },
          }}
        >
          Reply
        </Button>
        {/* Only show Delete if current user is the author */}
        {node.author._id === currentUserId && (
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={handleDelete}
            sx={{
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 2,
              borderWidth: 2,
              px: 2.5,
              py: 0.5,
              minWidth: 90,
              minHeight: 32,
              letterSpacing: 0.5,
              ml: 1,
              '&:hover': {
                backgroundColor: '#ffebee',
                borderColor: '#d32f2f',
              },
              color: '#d32f2f',
            }}
          >
            Delete
          </Button>
        )}
      </Stack>

      {showReplyForm && (
        <ReplyForm
          postId={node._id}
          communityId={communityId}
          onReply={() => {
            setShowReplyForm(false);
            onReply();
          }}
        />
      )}

      {Array.isArray(node.children) &&
        node.children.map(child =>
          child ? (
            <CommentNode
              key={child._id}
              node={child}
              communityId={communityId}
              onReply={onReply}
              parentMap={parentMap}
            />
          ) : null
        )}
    </Box>
  );
};

const DiscussionList = ({ communityId, refresh = 0 }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get(`/communities/${communityId}/posts`)
      .then(res => setPosts(res.data.posts || []))
      .catch(() => setPosts([]));
  }, [communityId, refresh]);

  const { tree, map } = buildTree(posts);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, color: '#7b1fa2', fontWeight: 'bold' }}>
        Discussions
      </Typography>

      {tree.length === 0 && (
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
          No discussions yet.
        </Typography>
      )}

      {tree.map(discussion => (
        <CommentNode
          key={discussion._id}
          node={discussion}
          communityId={communityId}
          onReply={() => setPosts([])} // Optionally, you can trigger a refresh here too
          parentMap={map}
        />
      ))}
    </Box>
  );
};

export default DiscussionList;
