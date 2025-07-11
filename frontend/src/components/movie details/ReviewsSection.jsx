// ReviewsSection.jsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Divider,
  IconButton,
  Paper,
  styled,
  Button,
  Alert,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { 
  ThumbUp, 
  ThumbDown, 
  Visibility, 
  VisibilityOff, 
  Star, 
  StarBorder,
  MoreVert,
  Report,
  Flag
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext"; // Import useAuth hook

const ReviewCard = styled(Paper)`
  background: rgba(50, 50, 50, 0.9);
  color: white;
  padding: 20px;
  margin-bottom: 15px;
  border-radius: 12px;
`;

const SpoilerButton = styled(Button)`
  background: ${props => props.showspoiler ? 'rgba(255, 152, 0, 0.8)' : 'rgba(255, 152, 0, 0.2)'};
  color: white;
  border: 1px solid #ff9800;
  &:hover {
    background: rgba(255, 152, 0, 0.9);
  }
`;

const StarRating = styled(Box)`
  display: flex;
  align-items: center;
  gap: 2px;
`;

const UserInfo = styled(Box)`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const VoteButton = styled(IconButton)`
  &.voted {
    color: #1976d2;
  }
  &.voted-down {
    color: #d32f2f;
  }
`;

const ReviewHeaderActions = styled(Box)`
  display: flex;
  align-items: center;
  gap: 1px;
`;

function ReviewsSection({ reviews, formatDate, onVoteReview, onReportReview, userVotes = {} }) {
  
  const [spoilerVisibility, setSpoilerVisibility] = useState({});
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const { isAuthenticated } = useAuth();
  
  console.log('Reviews in component:', reviews);
  console.log('First review user:', reviews?.[0]?.user);

  const toggleSpoilerVisibility = (reviewIndex) => {
    setSpoilerVisibility(prev => ({
      ...prev,
      [reviewIndex]: !prev[reviewIndex]
    }));
  };

  const handleVote = async (reviewId, voteType) => {
    if (!isAuthenticated) {
      alert('Please log in to vote on reviews');
      return;
    }

    try {
      await onVoteReview(reviewId, voteType);
    } catch (error) {
      console.error('Error voting:', error);
      alert('Failed to submit vote. Please try again.');
    }
  };

  const handleMenuOpen = (event, reviewId) => {
    setMenuAnchor(event.currentTarget);
    setSelectedReviewId(reviewId);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedReviewId(null);
  };

  const handleReportReview = async () => {
    if (!isAuthenticated) {
      alert('Please log in to report reviews');
      handleMenuClose();
      return;
    }

    try {
      await onReportReview(selectedReviewId);
      handleMenuClose();
    } catch (error) {
      console.error('Error reporting review:', error);
      alert('Failed to report review. Please try again.');
      handleMenuClose();
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 10; i++) {
      stars.push(
        <Box key={i} sx={{ color: i <= rating ? '#ffd700' : '#666' }}>
          {i <= rating ? <Star fontSize="small" /> : <StarBorder fontSize="small" />}
        </Box>
      );
    }
    return stars;
  };

  // Filter out rating-only submissions (reviews with empty title and content)
  const filteredReviews = reviews ? reviews.filter(review => {
    // Keep reviews that have either title or content (or both)
    return (review.title && review.title.trim() !== '') || 
           (review.content && review.content.trim() !== '');
  }) : [];

  if (!reviews || reviews.length === 0) {
    return (
      <Box>
        <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
          Reviews (0)
        </Typography>
        <Typography variant="body2" sx={{ color: 'grey.400', fontStyle: 'italic' }}>
          No reviews yet. Be the first to share your thoughts!
        </Typography>
      </Box>
    );
  }

  // If all reviews are filtered out (only ratings), show appropriate message
  if (filteredReviews.length === 0) {
    return (
      <Box>
        <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
          Reviews (0)
        </Typography>
        <Typography variant="body2" sx={{ color: 'grey.400', fontStyle: 'italic' }}>
          No written reviews yet. Users have rated this movie, but no detailed reviews have been submitted.
        </Typography>
        <Typography variant="body2" sx={{ color: 'grey.400', fontStyle: 'italic', mt: 1 }}>
          Be the first to write a review!
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
        Reviews ({filteredReviews.length})
      </Typography>
      {reviews.length > filteredReviews.length && (
        <Typography variant="body2" sx={{ color: 'grey.400', mb: 2, fontStyle: 'italic' }}>
          {reviews.length - filteredReviews.length} user{reviews.length - filteredReviews.length > 1 ? 's have' : ' has'} rated this movie without writing a review.
        </Typography>
      )}

      {filteredReviews.map((review, index) => (
        <ReviewCard key={review.id || index}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box flex={1}>
              <UserInfo>
                <Typography variant="body2" sx={{ 
                  color: '#64b5f6',
                  fontWeight: 'bold'
                }}>
                  @{review.user?.username || 'Anonymous'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'grey.400' }}>
                  •
                </Typography>
                <Typography variant="body2" sx={{ color: 'grey.400' }}>
                  {formatDate(review.createdat)}
                </Typography>
              </UserInfo>
              
              {review.title && review.title.trim() !== '' && (
                <Typography variant="h6" gutterBottom>
                  {review.title}
                </Typography>
              )}
              
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <StarRating>
                  {renderStars(review.ratingscore)}
                </StarRating>
                <Typography variant="body2" sx={{ 
                  background: 'linear-gradient(45deg, #ff6b6b, #ffd93d)', 
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  ml: 1
                }}>
                  {review.ratingscore}/10
                </Typography>
              </Box>
            </Box>
            
            <ReviewHeaderActions>
              {review.hasspoiler && (
                <>
                  <SpoilerButton
                    size="small"
                    startIcon={spoilerVisibility[index] ? <VisibilityOff /> : <Visibility />}
                    onClick={() => toggleSpoilerVisibility(index)}
                    showspoiler={spoilerVisibility[index]}
                  >
                    {spoilerVisibility[index] ? 'Hide Spoiler' : 'Show Spoiler'}
                  </SpoilerButton>
                  <Chip
                    label="Spoiler"
                    color="warning"
                    size="small"
                    sx={{ ml: 1 }}
                  />
                </>
              )}
              
              {/* Report Menu */}
              <IconButton
                size="small"
                onClick={(e) => handleMenuOpen(e, review.id)}
                sx={{ 
                  color: 'grey.400',
                  ml: 1,
                  '&:hover': { color: 'grey.300' }
                }}
              >
                <MoreVert />
              </IconButton>
            </ReviewHeaderActions>
          </Box>
          
          {review.content && review.content.trim() !== '' && (
            <>
              {review.hasspoiler && !spoilerVisibility[index] ? (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  This review contains spoilers. Click "Show Spoiler" to view the content.
                </Alert>
              ) : (
                <Typography variant="body1" mb={2} sx={{ lineHeight: 1.6 }}>
                  {review.content}
                </Typography>
              )}
            </>
          )}
          
          <Divider sx={{ backgroundColor: 'grey.700', mb: 2 }} />
          
          <Box display="flex" alignItems="center" gap={3}>
            <Box display="flex" alignItems="center" gap={1}>
              <VoteButton 
                size="small" 
                className={userVotes[review.id] === 'upvote' ? 'voted' : ''}
                sx={{ color: userVotes[review.id] === 'upvote' ? '#1976d2' : 'grey.400' }}
                onClick={() => handleVote(review.id, 'upvote')}
                disabled={!isAuthenticated}
              >
                <ThumbUp fontSize="small" />
              </VoteButton>
              <Typography variant="body2">{review.upvotes || 0}</Typography>
            </Box>
            
            <Box display="flex" alignItems="center" gap={1}>
              <VoteButton 
                size="small" 
                className={userVotes[review.id] === 'downvote' ? 'voted-down' : ''}
                sx={{ color: userVotes[review.id] === 'downvote' ? '#d32f2f' : 'grey.400' }}
                onClick={() => handleVote(review.id, 'downvote')}
                disabled={!isAuthenticated}
              >
                <ThumbDown fontSize="small" />
              </VoteButton>
              <Typography variant="body2">{review.downvotes || 0}</Typography>
            </Box>
            
            {!isAuthenticated && (
              <Typography variant="caption" sx={{ color: 'grey.500', ml: 'auto' }}>
                Login to vote on reviews
              </Typography>
            )}
          </Box>
        </ReviewCard>
      ))}

      {/* Report Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            bgcolor: 'rgba(40, 40, 40, 0.95)',
            color: 'white',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }
        }}
      >
        <MenuItem onClick={handleReportReview} disabled={!isAuthenticated}>
          <ListItemIcon>
            <Flag sx={{ color: isAuthenticated ? '#ff6b6b' : 'grey.500' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Report Review" 
            sx={{ color: isAuthenticated ? 'white' : 'grey.500' }}
          />
        </MenuItem>
        {!isAuthenticated && (
          <MenuItem disabled>
            <ListItemText 
              primary="Login to report"
              sx={{ color: 'grey.500', fontSize: '0.8rem' }}
            />
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
}

export default ReviewsSection;