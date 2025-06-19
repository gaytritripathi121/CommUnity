import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFoodPosts } from './foodSlice';
import FoodPostCard from './components/FoodPostCard';
import Loader from '../../shared/components/Loader';
import { Grid } from '@mui/material';

const FoodRescuePage = () => {
  const dispatch = useDispatch();
  const { foodPosts, loading } = useSelector(state => state.food);

  useEffect(() => {
    dispatch(fetchFoodPosts());
  }, [dispatch]);

  if (loading) return <Loader />;

  return (
    <Grid container spacing={2} p={2}>
      {foodPosts.map(post => (
        <FoodPostCard key={post._id} post={post} />
      ))}
    </Grid>
  );
};

export default FoodRescuePage;