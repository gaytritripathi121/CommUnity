import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  TextField,
  IconButton,
  Stack,
  CircularProgress
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import chatAPI from './chatAPI';

const ChatPage = ({ recipientId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const currentUserId = localStorage.getItem('userId');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!recipientId) return;
    setLoading(true);
    chatAPI.getMessages(currentUserId, recipientId)
      .then(msgs => {
        setMessages(msgs);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [recipientId, currentUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    try {
      const newMsg = await chatAPI.sendMessage(currentUserId, recipientId, input);
      setMessages((prev) => [...prev, {
        ...newMsg,
        sender: currentUserId,
        senderName: "You",
        senderAvatar: null,
      }]);
      setInput('');
    } catch (error) {
      // Optionally show an error snackbar
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Paper
      sx={{
        p: 2,
        maxWidth: 600,
        mx: 'auto',
        mt: 4,
        height: '70vh',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        boxShadow: 6,
        background: 'linear-gradient(135deg, #ede7f6 0%, #fff 100%)'
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ color: '#7b1fa2', fontWeight: 'bold' }}>
        Private Chat
      </Typography>
      <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2, pr: 1 }}>
        {loading ? (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          messages.map((msg) => (
            <Stack
              key={msg._id}
              direction="row"
              justifyContent={msg.sender === currentUserId ? 'flex-end' : 'flex-start'}
              alignItems="flex-end"
              sx={{ mb: 1 }}
            >
              {msg.sender !== currentUserId && (
                <Avatar
                  src={msg.senderAvatar || '/assets/default-avatar.png'}
                  alt={msg.senderName}
                  sx={{ width: 36, height: 36, mr: 1 }}
                />
              )}
              <Box
                sx={{
                  bgcolor: msg.sender === currentUserId ? '#7b1fa2' : '#e1bee7',
                  color: msg.sender === currentUserId ? '#fff' : '#4a148c',
                  borderRadius: 3,
                  px: 2,
                  py: 1,
                  maxWidth: '70%',
                  wordBreak: 'break-word',
                  boxShadow: 2,
                  position: 'relative'
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 'bold',
                    mb: 0.5,
                    color: msg.sender === currentUserId ? '#fff' : '#7b1fa2'
                  }}
                >
                  {msg.sender === currentUserId ? 'You' : msg.senderName}
                </Typography>
                <Typography variant="body1">{msg.text}</Typography>
                {msg.image && (
                  <Box
                    component="img"
                    src={msg.image}
                    alt="attachment"
                    sx={{ maxWidth: 150, mt: 1, borderRadius: 1 }}
                  />
                )}
              </Box>
              {msg.sender === currentUserId && (
                <Avatar
                  src={msg.senderAvatar || '/assets/default-avatar.png'}
                  alt="You"
                  sx={{ width: 36, height: 36, ml: 1 }}
                />
              )}
            </Stack>
          ))
        )}
        <div ref={messagesEndRef} />
      </Box>
      <Box
        component="form"
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        sx={{ display: 'flex', alignItems: 'center', mt: 1 }}
      >
        <TextField
          multiline
          maxRows={4}
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          fullWidth
          variant="outlined"
          size="small"
          sx={{ bgcolor: '#fff', borderRadius: 2 }}
        />
        <IconButton color="primary" onClick={handleSend} sx={{ ml: 1 }}>
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default ChatPage;
