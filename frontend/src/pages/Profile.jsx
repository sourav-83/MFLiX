import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Grid,
  Divider,
  Chip,
  Container,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Email,
  Star,
  RateReview,
  Bookmark,
  Movie
} from '@mui/icons-material';
import { useAuth } from '../components/contexts/AuthContext';
import Slide from '../components/common/Slide';
import axios from 'axios';
import url from '../constants/url';

const ProfileContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

const ProfileHeader = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  background: '#1E1E1E',
  color: '#E0E0E0',
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(3),
  border: '1px solid #333',
}));


const StatsCard = styled(Card)(({ theme }) => ({
  background: '#2A2A2A',
  color: '#E0E0E0',
  borderRadius: theme.spacing(2),
  height: '100%',
  transition: 'transform 0.3s ease-in-out',
  border: '1px solid #2E2E2E',
  '&:hover': {
    transform: 'translateY(-5px)',
    border: '1px solid #F5C518',
  },
}));


const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(12),
  height: theme.spacing(12),
  fontSize: '3rem',
  background: '#333333',
  color: '#F5C518',
  border: '3px solid #444',
  boxShadow: 'none',
  fontWeight: 'bold',
}));


const SectionTitle = styled(Typography)(({ theme }) => ({
  color: '#F5C518',
  fontWeight: 'bold',
  marginBottom: theme.spacing(2),
  marginTop: theme.spacing(4),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));


const MovieSection = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(2),
  backgroundColor: '#1A1A1A',
  borderRadius: theme.spacing(1),
  border: '1px solid #2E2E2E',
}));


const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const [profileStats, setProfileStats] = useState({
    ratingsCount: 0,
    reviewsCount: 0,
    watchlistCount: 0,
  });
  const [ratedMovies, setRatedMovies] = useState([]);
  const [reviewedMovies, setReviewedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchProfileData();
    }
  }, [isAuthenticated, user]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      
      // Fetch user statistics
      const statsResponse = await axios.get(`${url}/api/user/stats`);
      setProfileStats(statsResponse.data);

      // Fetch rated movies
      const ratedResponse = await axios.get(`${url}/api/user/rated-movies`);
      setRatedMovies(ratedResponse.data.movies || []);

      // Fetch reviewed movies
      const reviewedResponse = await axios.get(`${url}/api/user/reviewed-movies`);
      setReviewedMovies(reviewedResponse.data.movies || []);

    } catch (error) {
      console.error('Error fetching profile data:', error);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <ProfileContainer>
        <Alert severity="warning">
          Please log in to view your profile.
        </Alert>
      </ProfileContainer>
    );
  }

  if (loading) {
    return (
      <ProfileContainer>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
        </Box>
      </ProfileContainer>
    );
  }

  if (error) {
    return (
      <ProfileContainer>
        <Alert severity="error">{error}</Alert>
      </ProfileContainer>
    );
  }

  const getUserInitials = (name) => {
    return name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase() || 'U';
  };

  return (
    <ProfileContainer maxWidth="lg">
      {/* Profile Header */}
      <ProfileHeader elevation={3}>
        <Box display="flex" alignItems="center" gap={3}>
          <UserAvatar>
            {getUserInitials(user?.username || user?.name)}
          </UserAvatar>
          <Box flex={1}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              {user?.username || user?.name || 'User'}
            </Typography>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Email fontSize="small" />
              <Typography variant="h6">
                {user?.email || 'Email not available'}
              </Typography>
            </Box>
            {/* <Chip 
  label="Movie Enthusiast" 
  variant="outlined" 
  sx={{ 
    color: '#F5C518', 
    borderColor: '#F5C518',
    backgroundColor: 'transparent',
    fontWeight: 'bold'
  }} 
/> */}
          </Box>
        </Box>
      </ProfileHeader>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatsCard>
            <CardContent sx={{ textAlign: 'center' }}>
              <Star sx={{ fontSize: 40, mb: 1, color: '#F5C518' }} />
              <Typography variant="h4" fontWeight="bold">
                {profileStats.ratingsCount}
              </Typography>
              <Typography variant="body1">
                Movies Rated
              </Typography>
            </CardContent>
          </StatsCard>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatsCard>
            <CardContent sx={{ textAlign: 'center' }}>
              <RateReview sx={{ fontSize: 40, mb: 1, color: '#F5C518' }} />
              <Typography variant="h4" fontWeight="bold">
                {profileStats.reviewsCount}
              </Typography>
              <Typography variant="body1">
                Reviews Written
              </Typography>
            </CardContent>
          </StatsCard>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatsCard>
            <CardContent sx={{ textAlign: 'center' }}>
              <Bookmark sx={{ fontSize: 40, mb: 1, color: '#F5C518' }} />
              <Typography variant="h4" fontWeight="bold">
                {profileStats.watchlistCount}
              </Typography>
              <Typography variant="body1">
                Watchlist Movies
              </Typography>
            </CardContent>
          </StatsCard>
        </Grid>

        {/* <Grid item xs={12} sm={6} md={3}>
          <StatsCard sx={{ background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', color: '#333' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Movie sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {ratedMovies.length + reviewedMovies.length}
              </Typography>
              <Typography variant="body1">
                Total Interactions
              </Typography>
            </CardContent>
          </StatsCard>
        </Grid> */}
      </Grid>

      <Divider sx={{ my: 4, borderColor: '#404040' }} />

      {/* Rated Movies Section */}
      {ratedMovies.length > 0 && (
        <MovieSection>
          <SectionTitle variant="h4">
            <Star sx={{ color: '#F5C518' }} />
            Movies You've Rated
          </SectionTitle>
          <Slide movies={ratedMovies} />
        </MovieSection>
      )}

      {/* Reviewed Movies Section */}
      {reviewedMovies.length > 0 && (
        <MovieSection>
          <SectionTitle variant="h4">
            <RateReview sx={{ color: '#F5C518' }} />
            Movies You've Reviewed
          </SectionTitle>
          <Slide movies={reviewedMovies} />
        </MovieSection>
      )}

      {/* Empty State */}
      {ratedMovies.length === 0 && reviewedMovies.length === 0 && (
        <Box textAlign="center" py={8}>
          <Movie sx={{ fontSize: 80, color: '#666666', mb: 2 }} />
          <Typography variant="h5" color="#F5C518" gutterBottom>
            No movie interactions yet
          </Typography>
          <Typography variant="body1" color="#cccccc">
            Start rating and reviewing movies to see them here!
          </Typography>
        </Box>
      )}
    </ProfileContainer>
  );
};

export default Profile;