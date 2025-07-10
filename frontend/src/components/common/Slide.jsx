import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Box, styled, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const responsive = {
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 5, slidesToSlide: 5 },
  tablet: { breakpoint: { max: 1024, min: 464 }, items: 3, slidesToSlide: 3 },
  mobile: { breakpoint: { max: 464, min: 0 }, items: 1, slidesToSlide: 1 }
};

const Title = styled(Typography)`
  color: #FFFFFF;
`;

const StyledBanner = styled('img')({
  width: '100%',
  height: '350px',
  objectFit: 'cover',
  borderRadius: '8px',
});


const Slide = ({ movies }) => {
  return (
    <Carousel
      responsive={responsive}
      swipeable={false}
      draggable={false}
      showDots={false}
      infinite={true}
      autoPlay={true}
      autoPlaySpeed={3000}
      keyBoardControl={true}
      slidesToSlide={1}
    >
      {movies.map((movie) => (
        <Box key={movie.movieid} sx={{ px: 1 }}>
          <Link to={`/movie/${movie.movieid}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <StyledBanner src={`/img/${movie.titleimage}`} alt={movie.title} /> {/* Updated */}
            <Title>{movie.title}</Title>
          </Link>
        </Box>
      ))}
    </Carousel>
  );
};

export default Slide;
