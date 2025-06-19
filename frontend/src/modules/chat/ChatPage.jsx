import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import chatAPI from './chatAPI';

const ChatPage = ({ recipientId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const currentUserId = localStorage.getItem('userId');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!recipientId) return;
    chatAPI.getMessages(currentUserId, recipientId)
      .then(setMessages)
      .catch(console.error);
  }, [recipientId, currentUserId]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    try {
      const newMsg = await chatAPI.sendMessage(currentUserId, recipientId, input);
      setMessages((prev) => [...prev, newMsg]);
      setInput('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Paper sx={{ p: 2, maxWidth: 600, mx: 'auto', mt: 4, height: '70vh', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>Private Chat</Typography>
      <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2, border: '1px solid #ccc', borderRadius: 1, p: 1 }}>
        <List>
          {messages.map((msg) => (
            <ListItem key={msg._id} sx={{ justifyContent: msg.sender === currentUserId ? 'flex-end' : 'flex-start' }}>
              <ListItemText
                primary={msg.text}
                secondary={msg.image ? <img src={msg.image} alt="attachment" style={{ maxWidth: 150, marginTop: 4 }} /> : null}
                sx={{
                  bgcolor: msg.sender === currentUserId ? 'primary.light' : 'grey.300',
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  maxWidth: '70%',
                  wordBreak: 'break-word',
                }}
              />
            </ListItem>
          ))}
          <div ref={messagesEndRef} />
        </List>
      </Box>
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
    </Paper>
  );
};

export default ChatPage;
