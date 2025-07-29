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
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  IconButton,
  Rating,
  Collapse,
  Snackbar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Email,
  Star,
  RateReview,
  Bookmark,
  Movie,
  Warning,
  PersonOff,
  Edit,
  Delete,
  ExpandMore,
  ExpandLess,
  Save,
  Cancel,
  Visibility,
  VisibilityOff,
  LockReset // Icon for change password
} from '@mui/icons-material';
import { useAuth } from '../components/contexts/AuthContext';
import Slide from '../components/common/Slide';
import axios from 'axios';
import url from '../constants/url'; // Assuming this path is correct

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

const ReviewCard = styled(Card)(({ theme }) => ({
  background: '#2A2A2A',
  color: '#E0E0E0',
  marginBottom: theme.spacing(2),
  border: '1px solid #333',
  borderRadius: theme.spacing(1),
}));

const ReviewActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
}));

const EditButton = styled(IconButton)(({ theme }) => ({
  color: '#F5C518',
  '&:hover': {
    backgroundColor: 'rgba(245, 197, 24, 0.1)',
  },
}));

const DeleteButton = styled(IconButton)(({ theme }) => ({
  color: '#d32f2f',
  '&:hover': {
    backgroundColor: 'rgba(211, 47, 47, 0.1)',
  },
}));

const DeactivateButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#d32f2f',
  color: '#ffffff',
  '&:hover': {
    backgroundColor: '#b71c1c',
  },
  '&:disabled': {
    backgroundColor: '#666666',
    color: '#999999',
  },
}));

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [profileStats, setProfileStats] = useState({
    ratingsCount: 0,
    reviewsCount: 0,
    watchlistCount: 0,
  });
  const [ratedMovies, setRatedMovies] = useState([]);
  const [reviewedMovies, setReviewedMovies] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Deactivation dialog states
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [deactivating, setDeactivating] = useState(false);

  // Review management states
  const [editingReview, setEditingReview] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    content: '',
    rating: 0,
    hasSpoiler: false
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [expandedReviews, setExpandedReviews] = useState({});

  // New state for Change Password dialog
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);


  useEffect(() => {
    if (isAuthenticated && user) {
      // Set up axios defaults with auth token
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
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
      const reviewedMoviesData = reviewedResponse.data.movies || [];
      setReviewedMovies(reviewedMoviesData);

      // Fetch user's reviews - now independent of reviewed movies
      await fetchUserReviews();

    } catch (error) {
      console.error('Error fetching profile data:', error);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserReviews = async () => {
    try {
      console.log('Fetching all user reviews...');

      // Check if token exists and is set in axios defaults
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        setUserReviews([]);
        return;
      }

      // Ensure token is set in headers for this specific request
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      try {
        const response = await axios.get(`${url}/api/reviews/user/all`, config);
        console.log('User reviews response:', response.data);
        setUserReviews(response.data.reviews || []);
        return;
      } catch (error) {
        console.log('Error with user reviews endpoint:', error.response?.status, error.response?.data);

        // If it's a 401 (Unauthorized), the token might be invalid
        if (error.response?.status === 401) {
          console.log('Authentication failed, user might need to log in again');
          return;
        }

        console.log('Direct user reviews endpoint not available, using fallback method');
      }

      // Fallback: Use the reviewed movies approach
      const moviesData = reviewedMovies.length > 0 ? reviewedMovies : [];

      if (!moviesData || moviesData.length === 0) {
        console.log('No reviewed movies available');
        setUserReviews([]);
        return;
      }

      console.log('Fetching reviews for movies:', moviesData);

      // Fetch reviews for each reviewed movie
      const reviewPromises = moviesData.map(async (movie) => {
        try {
          console.log(`Fetching review for movie ID: ${movie.id}`);
          const response = await axios.get(`${url}/api/reviews/user/check/${movie.id}`, config);
          console.log(`Review response for movie ${movie.id}:`, response.data);

          if (response.data.hasReviewed) {
            return {
              ...response.data,
              movieId: movie.id,
              movieTitle: movie.Title || movie.name || `Movie ${movie.id}`,
              moviePoster: movie.poster_image // Ensure this comes from the movie data
            };
          }
          return null;
        } catch (error) {
          console.error(`Error fetching review for movie ${movie.id}:`, error);
          return null;
        }
      });

      const reviews = await Promise.all(reviewPromises);
      const validReviews = reviews.filter(Boolean);
      console.log('Fetched user reviews:', validReviews);
      setUserReviews(validReviews);
    } catch (error) {
      console.error('Error fetching user reviews:', error);
      setUserReviews([]);
    }
  };


  const handleEditReview = (review) => {
    setEditingReview(review.reviewId);
    setEditForm({
      title: review.title || '',
      content: review.content || '',
      rating: review.ratingscore || 0,
      hasSpoiler: review.hasSpoiler || false
    });
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
    setEditForm({
      title: '',
      content: '',
      rating: 0,
      hasSpoiler: false
    });
  };

  const handleSaveEdit = async (reviewId, movieId) => {
    try {
      const response = await axios.post(`${url}/api/reviews`, {
        movieId: movieId,
        title: editForm.title,
        content: editForm.content,
        rating: editForm.rating,
        hasSpoiler: editForm.hasSpoiler
      });

      // Update the review in the local state
      setUserReviews(prev => prev.map(review =>
        review.reviewId === reviewId
          ? { ...review, ...editForm, ratingscore: editForm.rating }
          : review
      ));

      setEditingReview(null);
      setSnackbar({
        open: true,
        message: 'Review updated successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error updating review:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update review',
        severity: 'error'
      });
    }
  };

  const handleDeleteReview = async () => {
    if (!reviewToDelete) return;

    try {
      await axios.delete(`${url}/api/reviews/${reviewToDelete}`);

      // Remove the review from local state
      setUserReviews(prev => prev.filter(review => review.reviewId !== reviewToDelete));

      setDeleteDialogOpen(false);
      setReviewToDelete(null);
      setSnackbar({
        open: true,
        message: 'Review deleted successfully!',
        severity: 'success'
      });

      // Update stats
      setProfileStats(prev => ({
        ...prev,
        reviewsCount: Math.max(0, prev.reviewsCount - 1)
      }));
    } catch (error) {
      console.error('Error deleting review:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete review',
        severity: 'error'
      });
    }
  };

  const handleDeactivateAccount = async () => {
    if (confirmationText.toLowerCase() !== 'deactivate') {
      return;
    }

    try {
      setDeactivating(true);

      // Call the deactivate endpoint
      await axios.post(`${url}/api/user/deactivate`);

      // Close dialog
      setDeactivateDialogOpen(false);

      // Show success message (optional)
      // Using Snackbar instead of alert for better UX
      setSnackbar({ open: true, message: 'Account deactivated successfully. You will be logged out.', severity: 'success' });

      // Automatically logout the user after a short delay to allow snackbar to show
      setTimeout(() => {
        logout();
      }, 1500);


    } catch (error) {
      console.error('Error deactivating account:', error);
      const errorMessage = error.response?.data?.message || 'Failed to deactivate account. Please try again.';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    } finally {
      setDeactivating(false);
    }
  };

  const handleCloseDeactivateDialog = () => {
    setDeactivateDialogOpen(false);
    setConfirmationText('');
  };

  const toggleReviewExpansion = (reviewId) => {
    setExpandedReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  // New function to handle password change
  const handleChangePassword = async () => {
    const { oldPassword, newPassword, confirmNewPassword } = passwordForm;

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      setSnackbar({ open: true, message: 'Please fill in all fields.', severity: 'warning' });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setSnackbar({ open: true, message: 'New passwords do not match.', severity: 'warning' });
      return;
    }
    if (newPassword.length < 1) { // Example minimum length
      setSnackbar({ open: true, message: 'New password must be at least 6 characters long.', severity: 'warning' });
      return;
    }

    setChangingPassword(true);
    try {
      await axios.post(`${url}/api/user/change-password`, {
        oldPassword,
        newPassword
      });
      setSnackbar({ open: true, message: 'Password changed successfully!', severity: 'success' });
      setChangePasswordDialogOpen(false);
      setPasswordForm({ oldPassword: '', newPassword: '', confirmNewPassword: '' }); // Clear form
    } catch (error) {
      console.error('Error changing password:', error);
      const errorMessage = error.response?.data?.message || 'Failed to change password. Please check your old password.';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    } finally {
      setChangingPassword(false);
    }
  };

  // Functions to toggle password visibility
  const handleClickShowOldPassword = () => setShowOldPassword((show) => !show);
  const handleMouseDownOldPassword = (event) => { event.preventDefault(); };

  const handleClickShowNewPassword = () => setShowNewPassword((show) => !show);
  const handleMouseDownNewPassword = (event) => { event.preventDefault(); };

  const handleClickShowConfirmNewPassword = () => setShowConfirmNewPassword((show) => !show);
  const handleMouseDownConfirmNewPassword = (event) => { event.preventDefault(); };


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

  const isConfirmationValid = confirmationText.toLowerCase() === 'deactivate';

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
      </Grid>

      <Divider sx={{ my: 4, borderColor: '#404040' }} />

      {/* User Reviews Section */}
      {userReviews.length > 0 && (
        <MovieSection>
          <SectionTitle variant="h4">
            <RateReview sx={{ color: '#F5C518' }} />
            Your Reviews
          </SectionTitle>

          {userReviews.map((review) => (
            <ReviewCard key={review.reviewId}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  {/* Movie Poster */}
                  {review.moviePoster && (
                    <Box sx={{ mr: 2, flexShrink: 0 }}>
                      <img
                        src={`/img/${review.moviePoster}`} // Assuming 'moviePoster' is just the filename
                        alt={review.movieTitle}
                        style={{ width: '80px', height: '120px', objectFit: 'cover', borderRadius: '4px' }}
                        onError={(e) => { e.target.onerror = null; e.target.src = '/img/placeholder.jpg'; }} // Add a placeholder image in public/img
                      />
                    </Box>
                  )}
                  <Box flex={1}>
                    <Typography variant="h6" color="#F5C518" gutterBottom>
                      {review.movieTitle}
                    </Typography>

                    {editingReview === review.reviewId ? (
                      <Box>
                        <TextField
                          fullWidth
                          label="Review Title"
                          value={editForm.title}
                          onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                          sx={{
                            mb: 2,
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: '#1A1A1A',
                              color: '#E0E0E0',
                            },
                            '& .MuiInputLabel-root': { color: '#B0B0B0' }
                          }}
                        />
                        <TextField
                          fullWidth
                          multiline
                          rows={4}
                          label="Review Content"
                          value={editForm.content}
                          onChange={(e) => setEditForm(prev => ({ ...prev, content: e.target.value }))}
                          sx={{
                            mb: 2,
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: '#1A1A1A',
                              color: '#E0E0E0',
                            },
                            '& .MuiInputLabel-root': { color: '#B0B0B0' }
                          }}
                        />
                        <Box display="flex" alignItems="center" gap={2} mb={2}>
                          <Typography component="legend">Rating:</Typography>
                          <Rating
                            value={editForm.rating}
                            max={10}
                            onChange={(event, newValue) => {
                              setEditForm(prev => ({ ...prev, rating: newValue }));
                            }}
                            sx={{ color: '#F5C518' }}
                          />
                        </Box>
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                          <IconButton
                            onClick={() => setEditForm(prev => ({ ...prev, hasSpoiler: !prev.hasSpoiler }))}
                            color={editForm.hasSpoiler ? "warning" : "inherit"}
                          >
                            {editForm.hasSpoiler ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                          <Typography>Contains Spoilers</Typography>
                        </Box>
                      </Box>
                    ) : (
                      <Box>
                        {review.title && (
                          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            {review.title}
                          </Typography>
                        )}

                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <Rating value={review.ratingscore} max={10} readOnly sx={{ color: '#F5C518' }} />
                          <Typography variant="body2">({review.ratingscore}/10)</Typography>
                          {review.hasSpoiler && (
                            <Chip
                              label="Spoiler"
                              size="small"
                              color="warning"
                              variant="outlined"
                            />
                          )}
                        </Box>

                        {review.content && (
                          <Box>
                            <Typography
                              variant="body2"
                              color="#CCCCCC"
                              sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: expandedReviews[review.reviewId] ? 'none' : 3,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}
                            >
                              {review.content}
                            </Typography>
                            {review.content.length > 200 && (
                              <Button
                                size="small"
                                onClick={() => toggleReviewExpansion(review.reviewId)}
                                startIcon={expandedReviews[review.reviewId] ? <ExpandLess /> : <ExpandMore />}
                                sx={{ color: '#F5C518', mt: 1 }}
                              >
                                {expandedReviews[review.reviewId] ? 'Show Less' : 'Show More'}
                              </Button>
                            )}
                          </Box>
                        )}

                        <Typography variant="caption" color="#888" display="block" mt={1}>
                          Reviewed on {new Date(review.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>

                <ReviewActions>
                  {editingReview === review.reviewId ? (
                    <>
                      <Button
                        startIcon={<Save />}
                        onClick={() => handleSaveEdit(review.reviewId, review.movieId)}
                        sx={{ color: '#F5C518' }}
                      >
                        Save
                      </Button>
                      <Button
                        startIcon={<Cancel />}
                        onClick={handleCancelEdit}
                        sx={{ color: '#888' }}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <EditButton
                        size="small"
                        onClick={() => handleEditReview(review)}
                        title="Edit Review"
                      >
                        <Edit fontSize="small" />
                      </EditButton>
                      <DeleteButton
                        size="small"
                        onClick={() => {
                          setReviewToDelete(review.reviewId);
                          setDeleteDialogOpen(true);
                        }}
                        title="Delete Review"
                      >
                        <Delete fontSize="small" />
                      </DeleteButton>
                    </>
                  )}
                </ReviewActions>
              </CardContent>
            </ReviewCard>
          ))}
        </MovieSection>
      )}

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
      {ratedMovies.length === 0 && reviewedMovies.length === 0 && userReviews.length === 0 && (
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

      {/* Account Deactivation and Password Change Buttons */}
      <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          onClick={() => setChangePasswordDialogOpen(true)}
          startIcon={<LockReset />}
          sx={{
            backgroundColor: '#F5C518',
            color: '#1A1A1A',
            '&:hover': {
              backgroundColor: '#E5B810',
            },
            borderRadius: '8px', // Added rounded corners
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Added shadow
            padding: '10px 20px', // Adjusted padding
            fontWeight: 'bold', // Made text bold
            textTransform: 'none', // Prevent uppercase transform
          }}
        >
          Change Password
        </Button>
        <DeactivateButton
          variant="contained"
          onClick={() => setDeactivateDialogOpen(true)}
          startIcon={<PersonOff />}
          sx={{
            borderRadius: '8px', // Added rounded corners
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Added shadow
            padding: '10px 20px', // Adjusted padding
            fontWeight: 'bold', // Made text bold
            textTransform: 'none', // Prevent uppercase transform
          }}
        >
          Deactivate Account
        </DeactivateButton>
      </Box>

      {/* Delete Review Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#1E1E1E',
            color: '#E0E0E0',
            border: '1px solid #333',
            borderRadius: '12px', // Rounded corners
          }
        }}
      >
        <DialogTitle sx={{ color: '#d32f2f', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Delete />
          Delete Review
        </DialogTitle>

        <DialogContent>
          <DialogContentText sx={{ color: '#E0E0E0' }}>
            Are you sure you want to delete this review? This action cannot be undone.
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ color: '#E0E0E0' }}
          >
            Cancel
          </Button>
          <DeactivateButton // Reusing DeactivateButton style for consistency
            onClick={handleDeleteReview}
            startIcon={<Delete />}
          >
            Delete Review
          </DeactivateButton>
        </DialogActions>
      </Dialog>

      {/* Deactivation Confirmation Dialog */}
      <Dialog
        open={deactivateDialogOpen}
        onClose={handleCloseDeactivateDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#1E1E1E',
            color: '#E0E0E0',
            border: '1px solid #333',
            borderRadius: '12px', // Rounded corners
          }
        }}
      >
        <DialogTitle sx={{ color: '#d32f2f', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Warning />
          Deactivate Account
        </DialogTitle>

        <DialogContent>
          <DialogContentText sx={{ color: '#E0E0E0', mb: 3 }}>
            This will deactivate your account and hide your reviews from public view. You can reactivate your account anytime by simply logging in again.
          </DialogContentText>

          <DialogContentText sx={{ color: '#E0E0E0', mt: 3, mb: 2 }}>
            To confirm, please type <strong>"deactivate"</strong> in the field below:
          </DialogContentText>

          <TextField
            fullWidth
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            placeholder="Type 'deactivate' to confirm"
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#2A2A2A',
                color: '#E0E0E0',
                borderRadius: '8px', // Rounded corners for text field
                '& fieldset': {
                  borderColor: '#404040',
                },
                '&:hover fieldset': {
                  borderColor: '#F5C518',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#F5C518',
                },
              },
              '& .MuiInputBase-input::placeholder': {
                color: '#999999',
              },
            }}
          />
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={handleCloseDeactivateDialog}
            sx={{ color: '#E0E0E0' }}
          >
            Cancel
          </Button>
          <DeactivateButton
            onClick={handleDeactivateAccount}
            disabled={!isConfirmationValid || deactivating}
            startIcon={deactivating ? <CircularProgress size={20} color="inherit" /> : <PersonOff />}
          >
            {deactivating ? 'Deactivating...' : 'Deactivate Account'}
          </DeactivateButton>
        </DialogActions>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog
        open={changePasswordDialogOpen}
        onClose={() => setChangePasswordDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#1E1E1E',
            color: '#E0E0E0',
            border: '1px solid #333',
            borderRadius: '12px', // Rounded corners
          }
        }}
      >
        <DialogTitle sx={{ color: '#F5C518', display: 'flex', alignItems: 'center', gap: 1 }}>
          <LockReset />
          Change Password
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Old Password"
            type={showOldPassword ? 'text' : 'password'}
            value={passwordForm.oldPassword}
            onChange={(e) => setPasswordForm(prev => ({ ...prev, oldPassword: e.target.value }))}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#2A2A2A',
                color: '#E0E0E0',
                borderRadius: '8px', // Rounded corners for text field
                '& fieldset': { borderColor: '#404040' },
                '&:hover fieldset': { borderColor: '#F5C518' },
                '&.Mui-focused fieldset': { borderColor: '#F5C518' },
              },
              '& .MuiInputLabel-root': { color: '#B0B0B0' },
              '& .MuiInputBase-input::placeholder': { color: '#999999' },
            }}
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={handleClickShowOldPassword}
                  onMouseDown={handleMouseDownOldPassword}
                  edge="end"
                  sx={{ color: '#B0B0B0' }}
                >
                  {showOldPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="New Password"
            type={showNewPassword ? 'text' : 'password'}
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#2A2A2A',
                color: '#E0E0E0',
                borderRadius: '8px', // Rounded corners for text field
                '& fieldset': { borderColor: '#404040' },
                '&:hover fieldset': { borderColor: '#F5C518' },
                '&.Mui-focused fieldset': { borderColor: '#F5C518' },
              },
              '& .MuiInputLabel-root': { color: '#B0B0B0' },
              '& .MuiInputBase-input::placeholder': { color: '#999999' },
            }}
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={handleClickShowNewPassword}
                  onMouseDown={handleMouseDownNewPassword}
                  edge="end"
                  sx={{ color: '#B0B0B0' }}
                >
                  {showNewPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Confirm New Password"
            type={showConfirmNewPassword ? 'text' : 'password'}
            value={passwordForm.confirmNewPassword}
            onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmNewPassword: e.target.value }))}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#2A2A2A',
                color: '#E0E0E0',
                borderRadius: '8px', // Rounded corners for text field
                '& fieldset': { borderColor: '#404040' },
                '&:hover fieldset': { borderColor: '#F5C518' },
                '&.Mui-focused fieldset': { borderColor: '#F5C518' },
              },
              '& .MuiInputLabel-root': { color: '#B0B0B0' },
              '& .MuiInputBase-input::placeholder': { color: '#999999' },
            }}
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={handleClickShowConfirmNewPassword}
                  onMouseDown={handleMouseDownConfirmNewPassword}
                  edge="end"
                  sx={{ color: '#B0B0B0' }}
                >
                  {showConfirmNewPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setChangePasswordDialogOpen(false)}
            sx={{ color: '#E0E0E0' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleChangePassword}
            disabled={changingPassword}
            startIcon={changingPassword ? <CircularProgress size={20} color="inherit" /> : <Save />}
            sx={{
              backgroundColor: '#F5C518',
              color: '#1A1A1A',
              '&:hover': {
                backgroundColor: '#E5B810',
              },
              '&:disabled': {
                backgroundColor: '#666666',
                color: '#999999',
              },
              borderRadius: '8px', // Added rounded corners
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Added shadow
              padding: '10px 20px', // Adjusted padding
              fontWeight: 'bold', // Made text bold
              textTransform: 'none', // Prevent uppercase transform
            }}
          >
            {changingPassword ? 'Changing...' : 'Change Password'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for success/error messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ProfileContainer>
  );
};

export default Profile;