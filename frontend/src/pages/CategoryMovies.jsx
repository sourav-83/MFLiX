// CategoryMovies.jsx
import Header from '../components/common/Header';
import { categoryMovies } from '../services/api';

import { Box, styled, Typography, Divider } from '@mui/material';
import { useState, useEffect } from 'react';

import { useLocation } from 'react-router-dom';

import MoviesList from '../components/common/MoviesList';

import { POPULAR_API_URL, UPCOMING_API_URL, TOPRATED_API_URL, moviesType } from '../constants/constant';

import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const responsive = {
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 1 },
  tablet: { breakpoint: { max: 1024, min: 464 }, items: 1 },
  mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
};

const StyledBanner = styled('div')`
  height: 450px;
  width: 100%;
  background-size: cover;
  background-position: center;
`;

const Component = styled(Box)`
  width: 80%;
  margin: auto;
`;

const Container = styled(Box)`
  background: #121212;
  padding: 20px;
  color: white;
`;

const CategoryMovies = () => {
  const [movies, setMovies] = useState([]);
  const { search } = useLocation();

  useEffect(() => {
    const getData = async (API_URL) => {
      const response = await categoryMovies(API_URL);
      setMovies(response || []);
    };

    let API_URL;
    if (search.includes('popular')) API_URL = POPULAR_API_URL;
    else if (search.includes('upcoming')) API_URL = UPCOMING_API_URL;
    else if (search.includes('toprated')) API_URL = TOPRATED_API_URL;

    getData(API_URL);
  }, [search]);

  return (
    <>
      <Component>
        <Carousel
          responsive={responsive}
          swipeable={false}
          draggable={false}
          showDots={false}
          infinite={true}
          autoPlay={true}
          autoPlaySpeed={3000}
          keyBoardControl={true}
        >
          {movies.map((movie) => (
            <StyledBanner
              key={movie.movieid}
              style={{ backgroundImage: `url(/img/${movie.posterimage})` }}
            />
          ))}
        </Carousel>
        <Container sx={{ mt: 4, mb: 6 }}>
  <Typography 
    variant="h6" 
    sx={{ color: '#F5C518', fontWeight: 600, mb: 1 }}
  >
    MFL!X Charts
  </Typography>

  <Typography 
    variant="h4" 
    sx={{ fontWeight: 700, mb: 1 }}
  >
    MFL!X {moviesType[search.split('=')[1]]} Movies
  </Typography>

  <Typography 
    variant="body2" 
    sx={{ fontSize: 14, color: 'text.secondary', mb: 2 }}
  >
    {/* IMDb Top {movies.length} as rated by regular IMDb voters. */}
  </Typography>

  <Divider sx={{ backgroundColor: '#444', mb: 3 }} />

  <MoviesList movies={movies} />
</Container>

      </Component>
    </>
  );
};

export default CategoryMovies;
