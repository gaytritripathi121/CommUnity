import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const FoodPostCard = ({ post }) => (
  <Card>
    <CardContent>
      <Typography variant="h6">{post.title}</Typography>
      <Typography variant="body2">{post.description}</Typography>
    </CardContent>
  </Card>
);

export default FoodPostCard;
