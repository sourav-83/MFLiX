// UserRatingDisplay.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  styled,
  IconButton,
  Button,
  Alert,
  Collapse,
  Divider,
} from "@mui/material";
import { Star, StarBorder, Edit, Close, Check } from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import url from "../../constants/url";

const UserRatingCard = styled(Paper)`
  background: rgba(30, 30, 30, 0.95);
  color: white;
  padding: 20px;
  margin-top: 30px;
  margin-bottom: 20px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
`;

const RatingSection = styled(Box)`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`;

const StarRating = styled(Box)`
  display: flex;
  align-items: center;
  gap: 2px;
`;

const RatingDisplay = styled(Typography)`
  color: #ffd700;
  font-weight: bold;
  font-size: 1.3rem;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
`;

const QuickRateButton = styled(Button)`
  background: linear-gradient(45deg, #1976d2, #42a5f5);
  color: white;
  border-radius: 20px;
  padding: 8px 20px;
  font-size: 0.9rem;
  text-transform: none;
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
  &:hover {
    background: linear-gradient(45deg, #1565c0, #1976d2);
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(25, 118, 210, 0.4);
  }
`;

const EditRatingButton = styled(IconButton)`
  color: #64b5f6;
  background: rgba(100, 181, 246, 0.1);
  &:hover {
    background: rgba(100, 181, 246, 0.2);
    color: #42a5f5;
  }
`;

const SaveButton = styled(IconButton)`
  color: #4caf50;
  background: rgba(76, 175, 80, 0.1);
  &:hover {
    background: rgba(76, 175, 80, 0.2);
  }
`;

const CancelButton = styled(IconButton)`
  color: #f44336;
  background: rgba(244, 67, 54, 0.1);
  &:hover {
    background: rgba(244, 67, 54, 0.2);
  }
`;

const InteractiveStarButton = styled(IconButton)`
  color: ${props => props.filled ? '#ffd700' : '#666'};
  padding: 4px;
  cursor: ${props => props.disabled ? 'default' : 'pointer'};
  transition: all 0.2s ease;
  
  &:hover {
    color: ${props => props.disabled ? (props.filled ? '#ffd700' : '#666') : '#ffd700'};
    transform: ${props => props.disabled ? 'none' : 'scale(1.1)'};
  }
  
  /* Override MUI's disabled styling */
  &.Mui-disabled {
    color: ${props => props.filled ? '#ffd700' : '#666'} !important;
  }
`;

function UserRatingDisplay({ movieId, onRatingChanged }) {
  const { isAuthenticated } = useAuth();
  const [userRating, setUserRating] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tempRating, setTempRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showQuickRate, setShowQuickRate] = useState(false);
  const [quickRateHover, setQuickRateHover] = useState(0);

  // Fetch user's rating for this movie
  const fetchUserRating = async () => {
    if (!isAuthenticated || !movieId) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${url}/api/reviews/user/check2/${movieId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.hasReviewed && response.data.ratingscore) {
        setUserRating(response.data.ratingscore);
      }
    } catch (error) {
      console.error('Error fetching user rating:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  };

  useEffect(() => {
    fetchUserRating();
  }, [movieId, isAuthenticated]);

  const handleQuickRate = async (rating) => {
    if (!isAuthenticated || !movieId) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const movieIdInt = parseInt(movieId, 10);
      
      const ratingData = {
        movieId: movieIdInt,
        rating: rating,
        title: '', // Empty for rating-only
        content: '', // Empty for rating-only
        hasSpoiler: false
      };

      await axios.post(`${url}/api/reviews`, ratingData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setUserRating(rating);
      setShowQuickRate(false);
      setQuickRateHover(0);
      
      // Notify parent component that rating has changed
      if (onRatingChanged) {
        onRatingChanged();
      }
      
    } catch (error) {
      console.error('Error submitting rating:', error);
      let errorMessage = 'Failed to submit rating';
      
      if (error.response?.status === 400 && 
          error.response.data?.message?.toLowerCase().includes('already')) {
        errorMessage = 'You have already rated this movie';
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEditRating = async () => {
    if (!isAuthenticated || !movieId) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Update rating via PUT request (you'll need this endpoint)
      await axios.put(`${url}/api/user/rating/${movieId}`, {
        rating: tempRating
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setUserRating(tempRating);
      setIsEditing(false);
      setHoverRating(0);
      
      // Notify parent component that rating has changed
      if (onRatingChanged) {
        onRatingChanged();
      }
      
    } catch (error) {
      console.error('Error updating rating:', error);
      alert('Failed to update rating');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating, isInteractive = false, size = "medium") => {
    const stars = [];
    const displayRating = isInteractive ? (hoverRating || rating) : rating;
    const iconSize = size === "small" ? "small" : "medium";

    for (let i = 1; i <= 10; i++) {
      const isFilled = i <= displayRating;
      
      stars.push(
        <InteractiveStarButton
          key={i}
          filled={isFilled}
          onClick={isInteractive ? () => setTempRating(i) : undefined}
          onMouseEnter={isInteractive ? () => setHoverRating(i) : undefined}
          onMouseLeave={isInteractive ? () => setHoverRating(0) : undefined}
          disabled={!isInteractive}
          size={size}
          disableRipple={!isInteractive}
        >
          {isFilled ? <Star fontSize={iconSize} /> : <StarBorder fontSize={iconSize} />}
        </InteractiveStarButton>
      );
    }
    return stars;
  };

  const renderQuickRateStars = () => {
    const stars = [];
    for (let i = 1; i <= 10; i++) {
      const isFilled = i <= quickRateHover;
      
      stars.push(
        <InteractiveStarButton
          key={i}
          filled={isFilled}
          onClick={() => handleQuickRate(i)}
          onMouseEnter={() => setQuickRateHover(i)}
          onMouseLeave={() => setQuickRateHover(0)}
          disabled={loading}
        >
          {isFilled ? <Star fontSize="medium" /> : <StarBorder fontSize="medium" />}
        </InteractiveStarButton>
      );
    }
    return stars;
  };

  // Don't show anything if user is not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <UserRatingCard>
      <Typography variant="h6" sx={{ mb: 2, color: '#e0e0e0' }}>
        Your Rating
      </Typography>
      
      {userRating ? (
        <Box>
          <RatingSection>
            <StarRating>
              {/* Fixed: Ensure stars show correctly when not editing */}
              {isEditing ? 
                renderStars(tempRating, true) : 
                renderStars(userRating, false)
              }
            </StarRating>
            
            {!isEditing && (
              <>
                <RatingDisplay>
                  {userRating}/10
                </RatingDisplay>
                <EditRatingButton
                  onClick={() => {
                    setIsEditing(true);
                    setTempRating(userRating);
                  }}
                  title="Edit your rating"
                >
                  <Edit fontSize="small" />
                </EditRatingButton>
              </>
            )}
            
            {isEditing && (
              <Box display="flex" gap={1} alignItems="center">
                <RatingDisplay>
                  {hoverRating || tempRating}/10
                </RatingDisplay>
                <SaveButton
                  onClick={handleEditRating}
                  disabled={loading}
                  title="Save changes"
                >
                  <Check fontSize="small" />
                </SaveButton>
                <CancelButton
                  onClick={() => {
                    setIsEditing(false);
                    setTempRating(userRating);
                    setHoverRating(0);
                  }}
                  disabled={loading}
                  title="Cancel"
                >
                  <Close fontSize="small" />
                </CancelButton>
              </Box>
            )}
          </RatingSection>
          
          {!isEditing && (
            <Typography variant="body2" sx={{ color: 'grey.400', mt: 1 }}>
              You rated this movie. Click the edit icon to change your rating.
            </Typography>
          )}
        </Box>
      ) : (
        <Box>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Typography variant="body1" sx={{ color: '#e0e0e0' }}>
              You haven't rated this movie yet.
            </Typography>
            <QuickRateButton
              onClick={() => setShowQuickRate(!showQuickRate)}
              disabled={loading}
            >
              {showQuickRate ? 'Cancel' : 'Quick Rate'}
            </QuickRateButton>
          </Box>
          
          <Collapse in={showQuickRate}>
            <Box>
              <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', mb: 2 }} />
              <Typography variant="body2" sx={{ color: '#e0e0e0', mb: 1 }}>
                Click a star to rate (hover to preview):
              </Typography>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                {renderQuickRateStars()}
              </Box>
              {quickRateHover > 0 && (
                <Typography variant="body2" sx={{ color: '#ffd700', fontWeight: 'bold' }}>
                  Rating: {quickRateHover}/10
                </Typography>
              )}
              <Typography variant="caption" sx={{ color: 'grey.500', display: 'block', mt: 1 }}>
                This will only submit your rating.
              </Typography>
            </Box>
          </Collapse>
        </Box>
      )}
    </UserRatingCard>
  );
}

export default UserRatingDisplay;