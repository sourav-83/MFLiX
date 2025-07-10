// HeroSection.jsx
import React from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Chip,
  Rating,
  Button,
  styled,
} from "@mui/material";
import {
  PlayArrow,
  Language,
  Schedule,
  CalendarToday,
  BookmarkAdd,
  BookmarkAdded,
  Star,
  StarBorder,
} from "@mui/icons-material";

const StyledHeroSection = styled(Box)`
  position: relative;
  min-height: 70vh;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  color: white;
`;

const HeroOverlay = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    rgba(0, 0, 0, 0.9) 0%,
    rgba(0, 0, 0, 0.7) 50%,
    rgba(0, 0, 0, 0.4) 100%
  );
`;

const ContentSection = styled(Container)`
  position: relative;
  z-index: 2;
  padding: 40px 20px;
`;

const TitleImage = styled('img')`
  max-height: 200px;
  width: auto;
  object-fit: contain;
  filter: drop-shadow(0 4px 20px rgba(255, 255, 255, 0.3));
  margin-bottom: 20px;
`;

const TrailerButton = styled(Button)`
  background: linear-gradient(45deg, #ff4081, #ff6ec7);
  color: white;
  padding: 12px 30px;
  border-radius: 25px;
  font-weight: bold;
  text-transform: none;
  margin: 10px;
  &:hover {
    background: linear-gradient(45deg, #e91e63, #ff4081);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 64, 129, 0.3);
  }
`;

const WatchlistButton = styled(Button)`
  background: linear-gradient(45deg, #4fc3f7, #29b6f6);
  color: white;
  padding: 12px 30px;
  border-radius: 25px;
  font-weight: bold;
  text-transform: none;
  margin: 10px;
  transition: all 0.3s ease;
  &:hover {
    background: linear-gradient(45deg, #29b6f6, #0288d1);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(79, 195, 247, 0.3);
  }
  &.added {
    background: linear-gradient(45deg, #66bb6a, #4caf50);
    &:hover {
      background: linear-gradient(45deg, #4caf50, #388e3c);
      box-shadow: 0 8px 25px rgba(76, 175, 80, 0.3);
    }
  }
  &.remove {
    background: linear-gradient(45deg, #f44336, #d32f2f);
    &:hover {
      background: linear-gradient(45deg, #d32f2f, #c62828);
      box-shadow: 0 8px 25px rgba(244, 67, 54, 0.3);
    }
  }
`;

const GenreChip = styled(Chip)`
  background: linear-gradient(45deg, #7b1fa2, #9c27b0);
  color: white;
  margin: 4px;
  font-weight: 500;
  &:hover {
    background: linear-gradient(45deg, #6a1b9a, #8e24aa);
  }
`;

const StarRatingContainer = styled(Box)`
  display: flex;
  align-items: center;
  gap: 2px;
`;

const StyledStarIcon = styled(Star)`
  color: #f5c518;
  font-size: 2rem;
  filter: drop-shadow(0 2px 4px rgba(245, 197, 24, 0.3));
`;

const StyledStarBorderIcon = styled(StarBorder)`
  color: rgba(255, 255, 255, 0.5);
  font-size: 2rem;
`;

function HeroSection({ 
  movie, 
  onTrailerPlay, 
  onWatchlistToggle, 
  watchlistButtonProps,
  formatDate,
  formatDuration 
}) {
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 10; i++) {
      if (i <= fullStars) {
        stars.push(
          <StyledStarIcon key={i} />
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <Box key={i} sx={{ position: 'relative', display: 'inline-flex' }}>
            <StyledStarBorderIcon />
            <StyledStarIcon 
              sx={{ 
                position: 'absolute',
                clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)'
              }} 
            />
          </Box>
        );
      } else {
        stars.push(
          <StyledStarBorderIcon key={i} />
        );
      }
    }
    return stars;
  };

  return (
    <StyledHeroSection
      sx={{
        backgroundImage: `url(/img/${movie.posterimage})`,
      }}
    >
      <HeroOverlay />
      <ContentSection maxWidth="xl">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box textAlign="center">
              <TitleImage
                src={`/img/${movie.titleimage}`}
                alt={`${movie.title} Title`}
              />
              
              <Box display="flex" justifyContent="center" alignItems="center" gap={2} mb={2}>
                <StarRatingContainer>
                  {renderStars(movie.averagerating)}
                </StarRatingContainer>
                <Typography variant="h5" sx={{ color: '#f5c518', fontWeight: 'bold' }}>
                  {movie.averagerating}/10
                </Typography>
              </Box>

              <Box display="flex" justifyContent="center" gap={2} mb={3} flexWrap="wrap">
                <Chip
                  icon={<Language />}
                  label={movie.language}
                  variant="outlined"
                  sx={{ color: 'white', borderColor: 'white' }}
                />
                <Chip
                  icon={<Schedule />}
                  label={formatDuration(movie.duration)}
                  variant="outlined"
                  sx={{ color: 'white', borderColor: 'white' }}
                />
                <Chip
                  icon={<CalendarToday />}
                  label={formatDate(movie.releasedate)}
                  variant="outlined"
                  sx={{ color: 'white', borderColor: 'white' }}
                />
              </Box>

              {/* Genres Section */}
              {movie.genres && movie.genres.length > 0 && (
                <Box display="flex" justifyContent="center" flexWrap="wrap" mb={3}>
                  {movie.genres.map((genre, index) => (
                    <GenreChip
                      key={index}
                      label={genre}
                      size="medium"
                    />
                  ))}
                </Box>
              )}

              {/* Action Buttons */}
              <Box display="flex" justifyContent="center" flexWrap="wrap">
                {movie.trailers && movie.trailers.length > 0 && (
                  <TrailerButton
                    startIcon={<PlayArrow />}
                    onClick={() => onTrailerPlay(movie.trailers[0])}
                    size="large"
                  >
                    Watch Trailer
                  </TrailerButton>
                )}
                
                <WatchlistButton
                  startIcon={watchlistButtonProps.startIcon}
                  onClick={onWatchlistToggle}
                  disabled={watchlistButtonProps.disabled}
                  size="large"
                  className={watchlistButtonProps.className}
                >
                  {watchlistButtonProps.text}
                </WatchlistButton>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
          </Grid>
        </Grid>
      </ContentSection>
    </StyledHeroSection>
  );
}

export default HeroSection;