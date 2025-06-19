import React, { useState } from 'react';
import { Box, Avatar, Typography, TextField, IconButton, List, ListItem } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import SendIcon from '@mui/icons-material/Send';

const ChatWindow = ({ messages, currentUserId, onSend }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <List sx={{ flexGrow: 1, overflowY: 'auto', mb: 1 }}>
        {messages.map((msg) => (
          <ListItem
            key={msg._id}
            sx={{
              display: 'flex',
              flexDirection: msg.sender === currentUserId ? 'row-reverse' : 'row',
              alignItems: 'flex-start',
              mb: 1,
            }}
          >
            {/* Avatar with link to profile */}
            <Avatar
              src={msg.senderAvatar || '/assets/default-avatar.png'}
              alt={msg.senderName}
              component={RouterLink}
              to={`/users/${msg.sender}`}
              sx={{ width: 36, height: 36, cursor: 'pointer', mx: 1 }}
            />

            <Box
              sx={{
                maxWidth: '70%',
                bgcolor: msg.sender === currentUserId ? 'primary.light' : 'grey.300',
                borderRadius: 2,
                px: 2,
                py: 1,
              }}
            >
              {/* Username clickable */}
              <Typography
                variant="subtitle2"
                component={RouterLink}
                to={`/users/${msg.sender}`}
                sx={{ textDecoration: 'none', color: 'text.primary', fontWeight: 'bold', cursor: 'pointer' }}
              >
                {msg.senderName}
              </Typography>

              {/* Message text */}
              <Typography variant="body1">{msg.text}</Typography>

              {/* Optional image */}
              {msg.image && (
                <Box
                  component="img"
                  src={msg.image}
                  alt="attachment"
                  sx={{ maxWidth: 150, mt: 1, borderRadius: 1 }}
                />
              )}
            </Box>
          </ListItem>
        ))}
      </List>

      <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSend(); }} sx={{ display: 'flex' }}>
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
        />
        <IconButton color="primary" onClick={handleSend} sx={{ ml: 1 }}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ChatWindow;
