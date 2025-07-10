// CastSection.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  styled,
  Rating,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Star, StarBorder } from "@mui/icons-material";
import { useNavigate } from "react-router-dom"; // Add this import
import axios from "axios";
import url from "../../constants/url";

const CastCard = styled(Card)`
  background: rgba(40, 40, 40, 0.9);
  color: white;
  height: 520px; /* Fixed height for all cards */
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
  cursor: pointer;
  &:hover {
    transform: translateY(-5px);
  }
`;

const StyledCardMedia = styled(CardMedia)`
  width: 100% !important; /* Force fixed width */
  height: 280px !important; /* Force fixed height for all images */
  min-height: 280px;
  max-height: 280px;
  object-fit: cover; /* Crop to fit maintaining aspect ratio */
  object-position: center top; /* Focus on the top-center of the image (usually the face) */
  display: block;
  flex-shrink: 0; /* Prevent shrinking */
`;

const StyledCardContent = styled(CardContent)`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px;
  height: 240px; /* Fixed height for content area */
  overflow: hidden;
`;

const ActorName = styled(Typography)`
  font-weight: 600;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const RoleName = styled(Typography)`
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ActorInfo = styled(Typography)`
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const RatingSection = styled(Box)`
  margin-top: auto; /* Push to bottom */
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const StyledRating = styled(Rating)`
  .MuiRating-iconFilled {
    color: #f5c518;
  }
  .MuiRating-iconEmpty {
    color: rgba(245, 197, 24, 0.3);
  }
`;

function CastSection({ cast, formatDate, isAuthenticated, movieId }) {
  const navigate = useNavigate(); // Add this hook
  const [castRatings, setCastRatings] = useState({});
  const [userRatings, setUserRatings] = useState({});
  const [loading, setLoading] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch user's existing ratings for all cast members
  useEffect(() => {
    if (isAuthenticated && cast && cast.length > 0) {
      fetchUserRatings();
    }
  }, [isAuthenticated, cast]);

  const fetchUserRatings = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const castIds = cast.map(actor => actor.CastID); // Use CastID for ratings
      const response = await axios.post(`${url}/api/cast/ratings/user`, {
        castIds: castIds,
        movieId: movieId
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const ratingsMap = {};
      response.data.forEach(rating => {
        ratingsMap[rating.castId] = rating.rating;
      });
      setUserRatings(ratingsMap);
    } catch (error) {
      console.error("Error fetching user ratings:", error);
    }
  };

  // Add navigation handler
  const handleActorClick = (actorId, event) => {
    // Prevent navigation when clicking on rating elements
    if (event.target.closest('.rating-section')) {
      return;
    }
    navigate(`/actor/${actorId}`);
  };

  const handleRatingChange = async (castId, newRating) => {
    if (!isAuthenticated) {
      setSnackbar({
        open: true,
        message: 'Please log in to rate cast members',
        severity: 'warning'
      });
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setSnackbar({
        open: true,
        message: 'Please log in to rate cast members',
        severity: 'warning'
      });
      return;
    }

    // Set loading state for this specific cast member
    setLoading(prev => ({ ...prev, [castId]: true }));

    try {
      // If rating is 0, remove the rating
      if (newRating === 0) {
        await axios.delete(`${url}/api/cast/${castId}/rating`, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          data: { movieId: movieId }
        });
        
        // Remove from user ratings
        setUserRatings(prev => {
          const updated = { ...prev };
          delete updated[castId];
          return updated;
        });
        
        setSnackbar({
          open: true,
          message: 'Rating removed successfully',
          severity: 'success'
        });
      } else {
        // Add or update rating
        await axios.post(`${url}/api/cast/${castId}/rating`, {
          rating: newRating,
          movieId: movieId
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // Update user ratings
        setUserRatings(prev => ({ ...prev, [castId]: newRating }));
        
        setSnackbar({
          open: true,
          message: 'Rating submitted successfully',
          severity: 'success'
        });
      }

      // Refresh cast ratings to get updated averages
      await fetchUpdatedCastRatings(castId);
      
    } catch (error) {
      console.error("Error submitting rating:", error);
      
      let errorMessage = 'Failed to submit rating';
      if (error.response?.status === 401) {
        errorMessage = 'Please log in to rate cast members';
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } else if (error.response?.status === 400) {
        errorMessage = 'Invalid rating value';
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setLoading(prev => ({ ...prev, [castId]: false }));
    }
  };

  const fetchUpdatedCastRatings = async (castId) => {
    try {
      const response = await axios.get(`${url}/api/cast/${castId}/rating-stats`);
      setCastRatings(prev => ({
        ...prev,
        [castId]: {
          averageRating: parseFloat(response.data.averageRating) || 0,
          totalRatings: parseInt(response.data.totalRatings) || 0
        }
      }));
    } catch (error) {
      console.error("Error fetching updated ratings:", error);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (!cast || cast.length === 0) {
    return null;
  }

  return (
    <Box mb={5}>
      <Typography variant="h4" gutterBottom sx={{ color: 'white', mb: 3 }}>
        Cast
      </Typography>
      <Grid container spacing={3}>
        {cast.map((actor, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <CastCard onClick={(event) => handleActorClick(actor.ActorID, event)}>
              <StyledCardMedia
                component="img"
                image={`/img/${actor.Image}`}
                alt={actor.Name}
              />
              <StyledCardContent>
                <ActorName variant="h6">
                  {actor.Name}
                </ActorName>
                <RoleName variant="body2" color="grey.400">
                  as {actor.RoleName}
                </RoleName>
                
                {/* Overall Rating Display */}
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Star sx={{ color: '#f5c518', fontSize: 16 }} />
                  <Typography variant="body2">
                    {castRatings[actor.CastID]?.averageRating && typeof castRatings[actor.CastID].averageRating === 'number'
                      ? `${castRatings[actor.CastID].averageRating.toFixed(1)}/10`
                      : `${actor.CastRating}/10`
                    }
                  </Typography>
                  {castRatings[actor.CastID]?.totalRatings && (
                    <Typography variant="body2" color="grey.500">
                      ({castRatings[actor.CastID].totalRatings} {castRatings[actor.CastID].totalRatings === 1 ? 'rating' : 'ratings'})
                    </Typography>
                  )}
                </Box>
                
                <ActorInfo variant="body2" color="grey.500">
                  {actor.Nationality} • Born {formatDate(actor.DateOfBirth)}
                </ActorInfo>

                {/* User Rating Section - Add className to prevent navigation */}
                <RatingSection className="rating-section">
                  <Typography variant="body2" color="grey.400" gutterBottom>
                    {isAuthenticated ? 'Your Rating:' : 'Rate this actor:'}
                  </Typography>
                  
                  {isAuthenticated ? (
                    <Box display="flex" alignItems="center" gap={1}>
                      <StyledRating
                        value={userRatings[actor.CastID] || 0}
                        onChange={(event, newValue) => {
                          event.stopPropagation(); // Prevent card click
                          handleRatingChange(actor.CastID, newValue);
                        }}
                        precision={1}
                        max={10}
                        icon={<Star fontSize="small" />}
                        emptyIcon={<StarBorder fontSize="small" />}
                        disabled={loading[actor.CastID]}
                      />
                      {loading[actor.CastID] && (
                        <CircularProgress size={16} sx={{ color: '#f5c518' }} />
                      )}
                    </Box>
                  ) : (
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        color: '#f5c518',
                        borderColor: '#f5c518',
                        '&:hover': {
                          borderColor: '#f5c518',
                          backgroundColor: 'rgba(245, 197, 24, 0.1)'
                        }
                      }}
                      onClick={(event) => {
                        event.stopPropagation(); // Prevent card click
                        setSnackbar({
                          open: true,
                          message: 'Please log in to rate cast members',
                          severity: 'warning'
                        });
                      }}
                    >
                      Login to Rate
                    </Button>
                  )}
                </RatingSection>
              </StyledCardContent>
            </CastCard>
          </Grid>
        ))}
      </Grid>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default CastSection;