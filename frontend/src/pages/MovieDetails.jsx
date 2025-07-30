// MovieDetails.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Box, Container, styled, Typography } from "@mui/material";
import { BookmarkAdd, BookmarkAdded, Star } from "@mui/icons-material";
import url from "../constants/url";

// Import reusable components
import HeroSection from "../components/movie details/HeroSection";
import SynopsisSection from "../components/movie details/SynopsisSection";
import AwardsSection from "../components/movie details/AwardsSection";
import CastSection from "../components/movie details/CastSection";
import CrewSection from "../components/movie details/CrewSection";
import StudiosSection from "../components/movie details/StudiosSection";
import ReviewsSection from "../components/movie details/ReviewsSection";
import UserReviewSection from "../components/movie details/UserReviewSection";
import TrailerDialog from "../components/movie details/TrailerDialog";
import NotificationSnackbar from "../components/movie details/NotificationSnackbar";
import { LoadingState, ErrorState, NotFoundState } from "../components/movie details/LoadingErrorStates";
import Slide from "../components/common/Slide";
import UserRatingDisplay from "../components/movie details/UserRatingDisplay";

const StyledContainer = styled(Container)`
  padding: 0;
  max-width: none !important;
`;

const SimilarMoviesSection = styled(Box)`
  background-color: #121212;
  padding: 40px 0;
`;

const SectionTitle = styled(Typography)`
  color: #FFFFFF;
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 24px;
  padding-left: 16px;
`;

// New styled components for the movie title section
const MovieTitleSection = styled(Box)`
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  padding: 40px 0 30px 0;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, 
      transparent 0%, 
      #F5C518 20%, 
      #FFD700 50%, 
      #F5C518 80%, 
      transparent 100%
    );
  }
`;

const MovieTitleContainer = styled(Container)`
  position: relative;
`;

const MovieTitle = styled(Typography)`
  color: #FFFFFF;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  text-align: center;
  margin-bottom: 16px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  letter-spacing: -0.02em;
  line-height: 1.1;
  
  background: linear-gradient(135deg, #FFFFFF 0%, #F5C518 50%, #FFFFFF 100%);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 3s ease-in-out infinite;
  
  @keyframes shimmer {
    0%, 100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }
`;

const MovieSubtitle = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 20px;
`;

const SubtitleItem = styled(Box)`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #B0B0B0;
  font-size: 16px;
  font-weight: 500;
`;

const RatingBadge = styled(Box)`
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(245, 197, 24, 0.1);
  border: 1px solid rgba(245, 197, 24, 0.3);
  border-radius: 20px;
  padding: 6px 12px;
  color: #F5C518;
  font-weight: 600;
`;

const YearBadge = styled(Box)`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 4px 12px;
  color: #FFFFFF;
  font-weight: 600;
  font-size: 14px;
`;

const GenreBadge = styled(Box)`
  background: rgba(245, 197, 24, 0.15);
  border-radius: 15px;
  padding: 4px 12px;
  color: #F5C518;
  font-weight: 500;
  font-size: 14px;
`;

const Divider = styled(Box)`
  width: 100px;
  height: 2px;
  background: linear-gradient(90deg, transparent 0%, #F5C518 50%, transparent 100%);
  margin: 0 auto 30px auto;
`;

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [selectedTrailer, setSelectedTrailer] = useState(null);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const [watchlistChecked, setWatchlistChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [similarMovies, setSimilarMovies] = useState([]); 
  const [similarMoviesLoading, setSimilarMoviesLoading] = useState(false);
  
  // New state for reviews
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState(null);
  const [userVotes, setUserVotes] = useState({});

  // Check authentication status
  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    return !!token;
  };

  // Fetch movie details
  const fetchMovieDetails = async (movieId) => {
    try {
      const response = await axios.get(`${url}/api/movies/${movieId}`);
      setMovie(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching movie details:", error);
      setError("Movie not found");
      throw error;
    }
  };

  // Fetch movie reviews
  const fetchMovieReviews = async (movieId) => {
    try {
      setReviewsLoading(true);
      setReviewsError(null);
      const response = await axios.get(`${url}/api/reviews/movie/${movieId}`);
      setReviews(response.data.reviews || []);
      
      // If user is authenticated, also fetch their vote status
      if (isAuthenticated) {
        await fetchUserVotes(movieId);
      }
    } catch (error) {
      console.error("Error fetching movie reviews:", error);
      setReviewsError("Failed to load reviews");
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  // Fetch user votes for reviews
  const fetchUserVotes = async (movieId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(`${url}/api/reviews/movie/${movieId}/votes`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setUserVotes(response.data.votes || {});
    } catch (error) {
      console.error("Error fetching user votes:", error);
      setUserVotes({});
    }
  };

  // Fetch similar movies
  const fetchSimilarMovies = async (movieId) => {
    try {
      setSimilarMoviesLoading(true);
      const response = await axios.get(`${url}/api/movies/${movieId}/similar`);
      setSimilarMovies(response.data);
    } catch (error) {
      console.error("Error fetching similar movies:", error);
      setSimilarMovies([]);
    } finally {
      setSimilarMoviesLoading(false);
    }
  };

  // Check if movie is in watchlist
  const checkWatchlistStatus = async (movieId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsInWatchlist(false);
        setWatchlistChecked(true);
        return;
      }

      setWatchlistLoading(true);
      const response = await axios.get(`${url}/api/watchlist/check/${movieId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setIsInWatchlist(response.data.inWatchlist);
      setWatchlistChecked(true);
    } catch (error) {
      console.error("Error checking watchlist status:", error);
      // If token is invalid, clear it
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
      }
      setIsInWatchlist(false);
      setWatchlistChecked(true);
    } finally {
      setWatchlistLoading(false);
    }
  };

  // Handle rating change - refresh movie details to get updated average rating
  const handleRatingChanged = async () => {
    try {
      await fetchMovieDetails(id);
      // Optional: Also refresh reviews to see the new rating reflected there
      await fetchMovieReviews(id);
    } catch (error) {
      console.error("Error refreshing movie details after rating change:", error);
    }
  };

  // Handle review voting
  const handleVoteReview = async (reviewId, voteType) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setSnackbarMessage('Please log in to vote on reviews');
      setSnackbarOpen(true);
      return;
    }

    try {
      await axios.post(`${url}/api/reviews/${reviewId}/vote`, {
        voteType: voteType // 'upvote' or 'downvote'
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Refresh reviews to get updated vote counts
      await fetchMovieReviews(id);
      
    } catch (error) {
      console.error('Error voting on review:', error);
      
      let errorMessage = 'Failed to vote on review';
      if (error.response?.status === 401) {
        errorMessage = 'Please log in to vote on reviews';
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
      } else if (error.response?.status === 400) {
        errorMessage = 'You have already voted on this review';
      } else if (error.response?.status === 403) {
        errorMessage = 'You cannot vote on your own review';
      }
      
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);
      throw error;
    }
  };

  // Handle review reporting
  const handleReportReview = async (reviewId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setSnackbarMessage('Please log in to report reviews');
      setSnackbarOpen(true);
      return;
    }

    try {
      await axios.post(`${url}/api/reviews/${reviewId}/report`, {
        reason: 'inappropriate_content' // You can make this configurable
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setSnackbarMessage('Review reported successfully. Thank you for helping maintain our community standards.');
      setSnackbarOpen(true);
      
    } catch (error) {
      console.error('Error reporting review:', error);
      
      let errorMessage = 'Failed to report review';
      if (error.response?.status === 401) {
        errorMessage = 'Please log in to report reviews';
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
      } else if (error.response?.status === 400) {
        errorMessage = 'You have already reported this review';
      } else if (error.response?.status === 403) {
        errorMessage = 'You cannot report your own review';
      } else if (error.response?.status === 404) {
        errorMessage = 'Review not found';
      }
      
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);
      throw error;
    }
  };

  // Initialize component
  useEffect(() => {
    const initializeComponent = async () => {
      if (!id) return;
      
      setLoading(true);
      setWatchlistChecked(false);
      
      // Check authentication status
      const authenticated = checkAuthStatus();
      
      try {
        // Fetch movie details
        await fetchMovieDetails(id);
        
        // Fetch movie reviews
        fetchMovieReviews(id);
        
        // Fetch similar movies in parallel
        fetchSimilarMovies(id);
        
        // Check watchlist status if authenticated
        if (authenticated) {
          await checkWatchlistStatus(id);
        } else {
          setWatchlistChecked(true);
          setIsInWatchlist(false);
        }
      } catch (error) {
        console.error("Error initializing component:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeComponent();
  }, [id]);

  // Listen for authentication changes (including login/logout in other tabs)
  useEffect(() => {
    const handleAuthChange = () => {
      const wasAuthenticated = isAuthenticated;
      const nowAuthenticated = checkAuthStatus();
      
      if (nowAuthenticated !== wasAuthenticated) {
        if (nowAuthenticated && id) {
          // User just logged in, check watchlist status and fetch user votes
          checkWatchlistStatus(id);
          fetchUserVotes(id);
        } else if (!nowAuthenticated) {
          // User just logged out, reset watchlist status and clear user votes
          setIsInWatchlist(false);
          setWatchlistChecked(true);
          setUserVotes({});
        }
      }
    };

    // Listen for storage changes (login/logout in another tab)
    window.addEventListener('storage', handleAuthChange);
    
    // Also listen for focus events to catch auth changes
    window.addEventListener('focus', handleAuthChange);
    
    return () => {
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('focus', handleAuthChange);
    };
  }, [id, isAuthenticated]);

  // Handle watchlist toggle
  const handleWatchlistToggle = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setSnackbarMessage('Please log in to manage your watchlist');
      setSnackbarOpen(true);
      return;
    }

    setWatchlistLoading(true);

    try {
      if (isInWatchlist) {
        // Remove from watchlist
        await axios.delete(`${url}/api/watchlist/remove`, {
          data: { movieid: parseInt(id) },
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setIsInWatchlist(false);
        setSnackbarMessage('Movie removed from watchlist');
      } else {
        // Add to watchlist
        await axios.post(`${url}/api/watchlist/add`, {
          movieid: parseInt(id)
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setIsInWatchlist(true);
        setSnackbarMessage('Movie added to watchlist');
      }
      
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error updating watchlist:", error);
      
      let errorMessage = 'Failed to update watchlist';
      if (error.response?.status === 400) {
        errorMessage = 'Movie is already in watchlist';
      } else if (error.response?.status === 401) {
        errorMessage = 'Please log in to manage your watchlist';
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsInWatchlist(false);
        setIsAuthenticated(false);
      } else if (error.response?.status === 404) {
        errorMessage = isInWatchlist ? 'Movie not found in watchlist' : 'Watchlist not found';
      }
      
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);
    } finally {
      setWatchlistLoading(false);
    }
  };

  const handleTrailerPlay = (trailer) => {
    setSelectedTrailer(trailer);
    setTrailerOpen(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // Get watchlist button props - Enhanced with better status detection
  const getWatchlistButtonProps = () => {
    // If not authenticated, show login prompt
    if (!isAuthenticated) {
      return {
        startIcon: <BookmarkAdd />,
        className: '',
        text: 'Login to Add to Watchlist',
        disabled: false
      };
    }

    // If watchlist status is being checked or updated
    if (watchlistLoading || !watchlistChecked) {
      return {
        startIcon: <BookmarkAdd />,
        className: '',
        text: 'Loading...',
        disabled: true
      };
    }

    // If movie is in watchlist
    if (isInWatchlist) {
      return {
        startIcon: <BookmarkAdded />,
        className: 'added',
        text: 'In Watchlist ✓',
        disabled: false
      };
    }

    // Default state - not in watchlist
    return {
      startIcon: <BookmarkAdd />,
      className: '',
      text: 'Add to Watchlist',
      disabled: false
    };
  };

  // Function to refresh reviews after a new review is added
  const handleReviewAdded = () => {
    fetchMovieReviews(id);
    // Also refresh movie details to update average rating
    fetchMovieDetails(id);
  };

  // Helper function to get release year from date
  const getReleaseYear = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).getFullYear();
  };

  // Helper function to get first genre
  const getPrimaryGenre = (genres) => {
    if (!genres || genres.length === 0) return '';
    return genres[0].name;
  };

  // Loading and error states
  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (!movie) {
    return <NotFoundState />;
  }

  const watchlistButtonProps = getWatchlistButtonProps();

  return (
    <StyledContainer>
      {/* Hero Section */}
      <HeroSection
        movie={movie}
        onTrailerPlay={handleTrailerPlay}
        onWatchlistToggle={handleWatchlistToggle}
        watchlistButtonProps={watchlistButtonProps}
        formatDate={formatDate}
        formatDuration={formatDuration}
      />
      
      {/* Movie Title Section - New attractive section */}
      <MovieTitleSection>
        <MovieTitleContainer maxWidth="xl">
          <MovieTitle variant="h1">
            {movie.title}
          </MovieTitle>
          
          <Divider />
        </MovieTitleContainer>
      </MovieTitleSection>
      
      {/* User Rating Display */}
      <UserRatingDisplay 
        movieId={id} 
        onRatingChanged={handleRatingChanged}
      />
      
      {/* Synopsis Section */}
      <SynopsisSection synopsis={movie.synopsis} />

      {/* Details Section */}
      <Box sx={{ backgroundColor: '#121212', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="xl">
          {/* Awards Section */}
          <AwardsSection awards={movie.awards} />

          {/* Cast Section */}
          <CastSection 
            cast={movie.cast} 
            formatDate={formatDate} 
            isAuthenticated={isAuthenticated}
            movieId={id}
          />

          {/* Crew Section */}
          <CrewSection 
            directors={movie.directors} 
            writers={movie.writers} 
            formatDate={formatDate} 
          />

          {/* Studios Section */}
          <StudiosSection studios={movie.studios} />

          {/* Reviews Section - Updated to include report functionality */}
          <ReviewsSection 
            reviews={reviews}
            reviewsLoading={reviewsLoading}
            reviewsError={reviewsError}
            formatDate={formatDate} 
            onVoteReview={handleVoteReview}
            onReportReview={handleReportReview}
            userVotes={userVotes}
          />
        </Container>
      </Box>

      {/* User Review Section */}
      <UserReviewSection 
        movieId={id} 
        isAuthenticated={isAuthenticated}
        onReviewAdded={handleReviewAdded}
      />

      {/* Similar Movies Section */}
      {!similarMoviesLoading && similarMovies.length > 0 && (
        <SimilarMoviesSection>
          <Container maxWidth="xl">
            <SectionTitle variant="h4" sx={{ color: '#F5C518' }}>
              More like this
            </SectionTitle>

            <Slide movies={similarMovies} />
          </Container>
        </SimilarMoviesSection>
      )}

      {/* Trailer Dialog */}
      <TrailerDialog
        open={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        selectedTrailer={selectedTrailer}
      />

      {/* Notification Snackbar */}
      <NotificationSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={() => setSnackbarOpen(false)}
      />
    </StyledContainer>
  );
}

export default MovieDetails;