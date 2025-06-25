import React, { useState } from 'react';
import { Button } from '@mui/material';
import axios from '@shared/axios';

const JoinButton = ({ communityId, isMember, onJoin }) => {
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    setLoading(true);
    try {
    
      await axios.post(`/communities/${communityId}/join`);
      onJoin();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to join community');
    } finally {
      setLoading(false);
    }
  };

  return (
    !isMember && (
      <Button 
        variant="contained" 
        color="primary"
        onClick={handleJoin}
        disabled={loading}
        sx={{ mt: 1 }}
      >
        {loading ? 'Joining...' : 'Join Community'}
      </Button>
    )
  );
};

export default JoinButton;
