// UserReviewSection.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Container,
  Typography,
  Paper,
  styled,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Alert,
  IconButton,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
} from "@mui/material";
import { Add, Star, StarBorder, RateReview, StarRate } from "@mui/icons-material";
import url from "../../constants/url";

const ReviewFormSection = styled(Box)`
  background-color: #1a1a1a;
  padding: 40px 0;
`;

const ReviewCard = styled(Paper)`
  background: rgba(50, 50, 50, 0.9);
  color: white;
  padding: 30px;
  border-radius: 12px;
  max-width: 800px;
  margin: 0 auto;
`;

const SubmitButton = styled(Button)`
  background: #1976d2;
  color: white;
  padding: 12px 32px;
  &:hover {
    background: #1565c0;
  }
`;

const StarRating = styled(Box)`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 16px;
`;

const RatingContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const RatingDisplay = styled(Typography)`
  color: #ffd700;
  font-weight: bold;
  font-size: 1.2rem;
`;

const OptionButton = styled(Button)`
  background: rgba(25, 118, 210, 0.1);
  color: white;
  border: 2px solid #1976d2;
  padding: 16px 24px;
  margin: 8px;
  border-radius: 12px;
  transition: all 0.3s ease;
  &:hover {
    background: rgba(25, 118, 210, 0.2);
    transform: translateY(-2px);
  }
`;

function UserReviewSection({ movieId, isAuthenticated }) {
  const [showOptions, setShowOptions] = useState(false);
  const [submissionType, setSubmissionType] = useState(''); // 'rating' or 'review'
  const [userHasReviewed, setUserHasReviewed] = useState(false);
  const [userHasRated, setUserHasRated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingReview, setCheckingReview] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    title: '',
    content: '',
    rating: 0,
    hasSpoiler: false
  });
  const [hoverRating, setHoverRating] = useState(0);

  // Check if user has already reviewed or rated this movie
  const checkUserReviewStatus = async () => {
    if (!isAuthenticated || !movieId) return;

    setCheckingReview(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${url}/api/reviews/user/check/${movieId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUserHasReviewed(response.data.hasReviewed);
      setUserHasRated(response.data.hasRated); // Assuming backend returns this
    } catch (error) {
      console.error('Error checking user review status:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } finally {
      setCheckingReview(false);
    }
  };

  useEffect(() => {
    checkUserReviewStatus();
  }, [movieId, isAuthenticated]);

  const handleSubmitRating = async () => {
    if (!isAuthenticated) {
      alert('Please log in to submit a rating');
      return;
    }

    if (!movieId) {
      alert('Movie ID is missing');
      return;
    }

    const movieIdInt = parseInt(movieId, 10);
    if (isNaN(movieIdInt)) {
      alert('Invalid movie ID');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const ratingData = {
        movieId: movieIdInt,
        rating: reviewForm.rating,
        // For rating-only submissions, we can either:
        // 1. Use a separate endpoint, or
        // 2. Send empty title/content to indicate rating-only
        title: '', // Empty title indicates rating-only
        content: '', // Empty content indicates rating-only
        hasSpoiler: false
      };

      const response = await axios.post(`${url}/api/reviews`, ratingData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Rating submitted successfully:', response.data);

      // Reset form and hide it
      setReviewForm({ title: '', content: '', rating: 5, hasSpoiler: false });
      setShowOptions(false);
      setSubmissionType('');
      setUserHasRated(true);
      
      alert('Rating submitted successfully!');
      window.location.reload();
      
    } catch (error) {
      console.error('Error submitting rating:', error);
      handleSubmissionError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    // Validation
    if (!reviewForm.title.trim() || !reviewForm.content.trim()) {
      alert('Please fill in all fields');
      return;
    }

    if (!isAuthenticated) {
      alert('Please log in to submit a review');
      return;
    }

    if (!movieId) {
      alert('Movie ID is missing');
      return;
    }

    const movieIdInt = parseInt(movieId, 10);
    if (isNaN(movieIdInt)) {
      alert('Invalid movie ID');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const reviewData = {
        movieId: movieIdInt,
        title: reviewForm.title.trim(),
        content: reviewForm.content.trim(),
        rating: reviewForm.rating,
        hasSpoiler: reviewForm.hasSpoiler
      };

      const response = await axios.post(`${url}/api/reviews`, reviewData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Review submitted successfully:', response.data);

      // Reset form and hide it
      setReviewForm({ title: '', content: '', rating: 5, hasSpoiler: false });
      setShowOptions(false);
      setSubmissionType('');
      setUserHasReviewed(true);
      setUserHasRated(true);
      
      alert('Review submitted successfully!');
      window.location.reload();
      
    } catch (error) {
      console.error('Error submitting review:', error);
      handleSubmissionError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmissionError = (error) => {
    let errorMessage = 'Failed to submit';
    
    if (error.response?.status === 400) {
      if (error.response.data?.message) {
        errorMessage = error.response.data.message;
      } else {
        errorMessage = 'Bad request - check your data';
      }
      if (errorMessage.toLowerCase().includes('already reviewed')) {
        setUserHasReviewed(true);
        setUserHasRated(true);
      }
    } else if (error.response?.status === 401) {
      errorMessage = 'Please log in to submit';
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } else if (error.response?.status === 404) {
      errorMessage = 'Movie not found';
    } else if (error.response?.status === 422) {
      errorMessage = 'Invalid data format';
    }
    
    alert(errorMessage);
  };

  const handleStarClick = (rating) => {
    setReviewForm(prev => ({ ...prev, rating }));
  };

  const handleStarHover = (rating) => {
    setHoverRating(rating);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  const renderStars = () => {
    const stars = [];
    const displayRating = hoverRating || reviewForm.rating;

    for (let i = 1; i <= 10; i++) {
      stars.push(
        <IconButton
          key={i}
          onClick={() => handleStarClick(i)}
          onMouseEnter={() => handleStarHover(i)}
          onMouseLeave={handleStarLeave}
          sx={{
            color: i <= displayRating ? '#ffd700' : '#666',
            padding: '4px',
            '&:hover': {
              color: '#ffd700'
            }
          }}
        >
          {i <= displayRating ? <Star /> : <StarBorder />}
        </IconButton>
      );
    }
    return stars;
  };

  if (!isAuthenticated) {
    return null;
  }

  if (checkingReview) {
    return (
      <ReviewFormSection>
        <Container maxWidth="xl">
          <Typography variant="h5" sx={{ color: 'white', textAlign: 'center' }}>
            Checking review status...
          </Typography>
        </Container>
      </ReviewFormSection>
    );
  }

  return (
    <ReviewFormSection>
      <Container maxWidth="xl">
        {/* Show options if user hasn't reviewed/rated yet */}
        {!userHasReviewed && !userHasRated && !showOptions && (
          <Box display="flex" justifyContent="center" flexDirection="column" alignItems="center">
            <Typography variant="h5" sx={{ color: 'white', mb: 3, textAlign: 'center' }}>
              Share Your Opinion
            </Typography>
            <Box display="flex" gap={2} flexWrap="wrap" justifyContent="center">
              <OptionButton
                startIcon={<StarRate />}
                onClick={() => {
                  setShowOptions(true);
                  setSubmissionType('rating');
                }}
              >
                Just Rate This Movie
              </OptionButton>
              <OptionButton
                startIcon={<RateReview />}
                onClick={() => {
                  setShowOptions(true);
                  setSubmissionType('review');
                }}
              >
                Write a Full Review
              </OptionButton>
            </Box>
          </Box>
        )}

        {/* Show status if user has already submitted */}
        {(userHasReviewed || userHasRated) && !showOptions && (
          <Box display="flex" justifyContent="center">
            <Alert severity="info" sx={{ maxWidth: '600px' }}>
              {userHasReviewed 
                ? "You have already submitted a review for this movie."
                : "You have already rated this movie."
              }
            </Alert>
          </Box>
        )}

        {/* Rating Only Form */}
        {showOptions && submissionType === 'rating' && (
          <ReviewCard>
            <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
              Rate This Movie
            </Typography>
            
            <RatingContainer mb={3}>
              <Typography component="legend" sx={{ color: 'white', mb: 1, fontSize: '1.1rem', textAlign: 'center' }}>
                How would you rate this movie?
              </Typography>
              <Box display="flex" justifyContent="center" alignItems="center" gap={2}>
                <StarRating>
                  {renderStars()}
                </StarRating>
                <RatingDisplay>
                  {hoverRating || reviewForm.rating}/10
                </RatingDisplay>
              </Box>
            </RatingContainer>

            <Box display="flex" justifyContent="center" gap={2}>
              <SubmitButton 
                onClick={handleSubmitRating}
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Rating'}
              </SubmitButton>
              <Button
                variant="outlined"
                onClick={() => {
                  setShowOptions(false);
                  setSubmissionType('');
                }}
                disabled={loading}
                sx={{ 
                  color: 'white', 
                  borderColor: 'white',
                  padding: '12px 32px',
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.8)',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                Cancel
              </Button>
            </Box>
          </ReviewCard>
        )}

        {/* Full Review Form */}
        {showOptions && submissionType === 'review' && (
          <ReviewCard>
            <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
              Write Your Review
            </Typography>
            
            <TextField
              fullWidth
              label="Review Title"
              value={reviewForm.title}
              onChange={(e) => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
              sx={{ 
                mb: 3, 
                '& .MuiInputLabel-root': { color: 'white' }, 
                '& .MuiOutlinedInput-root': { 
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)'
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.5)'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1976d2'
                  }
                }
              }}
            />

            <RatingContainer mb={3}>
              <Typography component="legend" sx={{ color: 'white', mb: 1, fontSize: '1.1rem' }}>
                Rating
              </Typography>
              <StarRating>
                {renderStars()}
                <RatingDisplay>
                  {hoverRating || reviewForm.rating}/10
                </RatingDisplay>
              </StarRating>
            </RatingContainer>

            <TextField
              fullWidth
              multiline
              rows={6}
              label="Review Content"
              placeholder="Share your thoughts about this movie..."
              value={reviewForm.content}
              onChange={(e) => setReviewForm(prev => ({ ...prev, content: e.target.value }))}
              sx={{ 
                mb: 3, 
                '& .MuiInputLabel-root': { color: 'white' }, 
                '& .MuiOutlinedInput-root': { 
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)'
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.5)'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1976d2'
                  }
                }
              }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={reviewForm.hasSpoiler}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, hasSpoiler: e.target.checked }))}
                  sx={{ 
                    color: 'white',
                    '&.Mui-checked': {
                      color: '#ff9800'
                    }
                  }}
                />
              }
              label="This review contains spoilers"
              sx={{ color: 'white', mb: 3 }}
            />

            <Box display="flex" justifyContent="center" gap={2}>
              <SubmitButton 
                onClick={handleSubmitReview}
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Review'}
              </SubmitButton>
              <Button
                variant="outlined"
                onClick={() => {
                  setShowOptions(false);
                  setSubmissionType('');
                }}
                disabled={loading}
                sx={{ 
                  color: 'white', 
                  borderColor: 'white',
                  padding: '12px 32px',
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.8)',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                Cancel
              </Button>
            </Box>
          </ReviewCard>
        )}
      </Container>
    </ReviewFormSection>
  );
}

export default UserReviewSection;