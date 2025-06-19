import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  Grow,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CommunityCard from './components/CommunityCard';
import { fetchCommunitiesByCategory } from './communityAPI';

const CommunityCategoryPage = () => {
  const { categoryName } = useParams();
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchCommunitiesByCategory(categoryName);
        setCommunities(res || []);
      } catch (err) {
        setError('Failed to load communities. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [categoryName]);

  const filteredCommunities = communities.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #f3e5f5 0%, #ede7f6 100%)',
        minHeight: '100vh',
        py: 6,
        px: { xs: 2, sm: 4, md: 6 },
      }}
    >
      <Container maxWidth="lg" sx={{ mb: 4 }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/communities')}
          sx={{
            mb: 3,
            borderColor: '#4a148c',
            color: '#4a148c',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#4a148c',
              color: 'white',
            },
          }}
        >
          ← Back to Categories
        </Button>

        <Typography
          variant="h4"
          fontWeight="bold"
          color="#4a148c"
          gutterBottom
          sx={{ fontFamily: "'Poppins', sans-serif", textAlign: 'center' }}
        >
          {decodeURIComponent(categoryName)} Communities
        </Typography>

        <Typography
          variant="subtitle1"
          color="#7b1fa2"
          sx={{ fontStyle: 'italic', textAlign: 'center', mb: 4 }}
        >
          Find your community and start connecting today!
        </Typography>

        <TextField
          fullWidth
          placeholder="Search communities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 4 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="disabled" />
              </InputAdornment>
            ),
          }}
        />
      </Container>

      {loading ? (
        <Typography variant="h6" align="center" color="text.secondary" mt={6}>
          Loading communities...
        </Typography>
      ) : error ? (
        <Typography variant="h6" align="center" color="error" mt={6}>
          {error}
        </Typography>
      ) : filteredCommunities.length === 0 ? (
        <Typography variant="h6" align="center" color="text.secondary" mt={6}>
          No communities found matching your search.
        </Typography>
      ) : (
        <Grid container spacing={4} justifyContent="center">
          {filteredCommunities.map((community, index) => (
            <Grid item xs={12} sm={6} md={4} key={community._id}>
              <Grow in timeout={300 + index * 150}>
                <Box>
                  <CommunityCard community={community} />
                </Box>
              </Grow>
            </Grid>
          ))}
        </Grid>
      )}

      <Container maxWidth="lg" sx={{ mt: 6, textAlign: 'center' }}>
        <Button
          variant="contained"
          onClick={() => navigate('/communities/create')}
          sx={{
            backgroundColor: '#4a148c',
            borderRadius: 3,
            textTransform: 'none',
            fontWeight: 'medium',
            px: 4,
            py: 1.5,
            boxShadow: '0 4px 12px rgba(74, 20, 140, 0.4)',
            '&:hover': {
              backgroundColor: '#38006b',
              boxShadow: '0 6px 16px rgba(56, 0, 107, 0.6)',
            },
          }}
        >
          + Create New Community
        </Button>
      </Container>
    </Box>
  );
};

export default CommunityCategoryPage;
