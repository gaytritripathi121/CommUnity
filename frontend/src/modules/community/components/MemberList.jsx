import React from 'react';
import {
  Avatar,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Stack,
  Box,
  Tooltip,
  Fade
} from '@mui/material';
import { Star, StarBorder } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const MemberList = ({ members, admins, currentUserId, onPromote }) => {
  const adminIds = admins.map(a => (a._id ? a._id.toString() : a.toString()));

  return (
    <Stack spacing={2} sx={{ mt: 2 }}>
      <Typography
        variant="h6"
        sx={{
          color: '#7b1fa2',
          fontWeight: 700,
          letterSpacing: 1,
          mb: 1
        }}
      >
        Members
      </Typography>
      <Stack spacing={2}>
        {members.map(member => {
          const isAdmin = adminIds.includes(member._id.toString());
          const canPromote =
            adminIds.includes(currentUserId) &&
            !isAdmin &&
            member._id !== currentUserId;
          return (
            <Card
              key={member._id}
              elevation={3}
              sx={{
                borderRadius: 3,
                background: isAdmin
                  ? 'linear-gradient(90deg, #ce93d8 0%, #7b1fa2 100%)'
                  : 'linear-gradient(90deg, #f3e5f5 0%, #ede7f6 100%)',
                transition: 'transform 0.18s, box-shadow 0.18s',
                boxShadow: isAdmin
                  ? '0 4px 16px rgba(123,31,162,0.14)'
                  : '0 2px 8px rgba(123,31,162,0.08)',
                '&:hover': { transform: 'scale(1.018)', boxShadow: '0 8px 24px #ba68c8' },
                px: 1,
              }}
            >
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
                {/* Make the member info clickable */}
                <Box
                  component={Link}
                  to={`/users/${member._id}`}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexGrow: 1,
                    textDecoration: 'none',
                    cursor: 'pointer',
                    '&:hover .member-name': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  <Avatar
                    src={member.avatar}
                    alt={member.name}
                    sx={{
                      width: 48,
                      height: 48,
                      border: isAdmin ? '2px solid #7b1fa2' : '2px solid #ce93d8',
                      boxShadow: 2,
                      bgcolor: isAdmin ? '#7b1fa2' : '#f3e5f5',
                      color: isAdmin ? '#fff' : '#7b1fa2',
                      fontWeight: 700
                    }}
                  >
                    {member.name?.[0]}
                  </Avatar>
                  <Box sx={{ ml: 2 }}>
                    <Typography
                      variant="subtitle1"
                      className="member-name"
                      sx={{
                        fontWeight: 600,
                        color: isAdmin ? '#fff' : '#7b1fa2',
                        textShadow: isAdmin ? '0 1px 8px #7b1fa2' : 'none'
                      }}
                    >
                      {member.name}{' '}
                      <Typography
                        component="span"
                        sx={{
                          color: isAdmin ? '#ede7f6' : '#9c27b0',
                          fontSize: 14,
                          fontWeight: 400,
                          ml: 1
                        }}
                      >
                        @{member.username}
                      </Typography>
                    </Typography>
                    {isAdmin && (
                      <Tooltip title="Admin" TransitionComponent={Fade}>
                        <Chip
                          icon={<Star sx={{ color: '#fffde7' }} />}
                          label="Admin"
                          color="secondary"
                          size="small"
                          sx={{
                            fontWeight: 700,
                            letterSpacing: 0.5,
                            background: 'linear-gradient(90deg, #ab47bc 0%, #7b1fa2 100%)',
                            color: '#fff',
                            mt: 0.5
                          }}
                        />
                      </Tooltip>
                    )}
                  </Box>
                </Box>
                {/* Promote button (not part of the link) */}
                {canPromote && (
                  <Button
                    size="small"
                    variant="contained"
                    color="secondary"
                    startIcon={<StarBorder />}
                    sx={{
                      fontWeight: 600,
                      textTransform: 'none',
                      borderRadius: 2,
                      background: 'linear-gradient(90deg, #7b1fa2 0%, #ce93d8 100%)',
                      color: '#fff',
                      boxShadow: 1,
                      '&:hover': {
                        background: 'linear-gradient(90deg, #ce93d8 0%, #7b1fa2 100%)'
                      }
                    }}
                    onClick={() => onPromote(member._id)}
                  >
                    Make Admin
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </Stack>
    </Stack>
  );
};

export default MemberList;
