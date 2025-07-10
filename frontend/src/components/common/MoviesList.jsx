import { Box, Typography, styled } from "@mui/material";
import { Star } from '@mui/icons-material';
import { useNavigate } from "react-router-dom";

const Banner = styled('img')({
  width: 83,
  height: 120,
  objectFit: 'cover',
  borderRadius: 8,
  marginRight: 10,
});

const Container = styled(Box)`
  display: flex;
  align-items: center;
  background-color: #1c1c1c;
  color: white;
  border-radius: 10px;
  padding: 10px;
  margin: 10px 0;
  transition: transform 0.2s ease-in-out;
  cursor: pointer;
  &:hover {
    transform: scale(1.02);
    background-color: #2a2a2a;
  }
`;

const MoviesList = ({ movies }) => {
  const navigate = useNavigate();

  if (!movies) {
    return (
      <Box>
        <Typography sx={{ color: 'orange', mt: 2 }}>
          Debug: Movies prop is null/undefined
        </Typography>
      </Box>
    );
  }

  if (!Array.isArray(movies)) {
    return (
      <Box>
        <Typography sx={{ color: 'orange', mt: 2 }}>
          Debug: Movies prop is not an array (type: {typeof movies})
        </Typography>
        <Typography sx={{ color: '#ccc', mt: 1, fontSize: '0.8rem' }}>
          Received: {JSON.stringify(movies)}
        </Typography>
      </Box>
    );
  }

  if (movies.length === 0) {
    return (
      <Typography sx={{ color: '#fff', mt: 2 }}>
        No movies to display
      </Typography>
    );
  }

  return (
    <Box>
      {movies.map((movie, index) => {
        const movieKey = movie.movieid || movie.id || index;

        return (
          <Container
            key={movieKey}
            onClick={() => {
              const movieId = movie.movieid || movie.id;
              if (movieId) {
                navigate(`/movie/${movieId}`);
              } else {
                console.error("No movieid found for movie:", movie);
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              {/* Movie Poster */}
              <Banner
                src={movie.titleimage ? `/img/${movie.titleimage}` : '/img/placeholder.png'}
                alt={movie.title || 'Movie'}
                onError={(e) => {
                  console.log(`Image failed to load: /img/${movie.titleimage}`);
                  e.target.src = '/img/placeholder.png';
                }}
              />

              {/* Movie Info */}
              <Box 
                sx={{ 
                  flex: 1, 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  flexWrap: 'wrap' 
                }}
              >
                {/* Title */}
                <Typography variant="h6" sx={{ flex: 1, minWidth: '150px' }}>
                  {movie.title || 'Unknown Title'}
                </Typography>

                {/* Rating, Duration, Release Year */}
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 4, // More space between items
                    flexWrap: 'wrap',
                    justifyContent: 'flex-end' 
                  }}
                >
                  {/* Rating */}
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Star color="warning" sx={{ mr: 0.5 }} />
                    <Typography>
                      {movie.averagerating ? Number(movie.averagerating).toFixed(1) : 'N/A'}
                    </Typography>
                  </Box>

                  {/* Duration */}
                  <Typography>
                    {movie.duration ? `${movie.duration} min` : 'Duration N/A'}
                  </Typography>

                  {/* Release Year */}
                  <Typography>
                    {movie.releasedate ? new Date(movie.releasedate).getFullYear() : 'Unknown'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Container>
        );
      })}
    </Box>
  );
};

export default MoviesList;
