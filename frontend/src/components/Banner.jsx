import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Box, styled } from '@mui/material';
import { Link } from 'react-router-dom';

const responsive = {
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 1, slidesToSlide: 1 },
  tablet: { breakpoint: { max: 1024, min: 464 }, items: 1, slidesToSlide: 1 },
  mobile: { breakpoint: { max: 464, min: 0 }, items: 1, slidesToSlide: 1 }
};

const StyledBanner = styled('img')({
  width: '100%',
  height: '450px',
  objectFit: 'cover', 
  borderRadius: '8px',
});


const Banner = ({ movies }) => {
  return (
    <Box style={{ width: '65%' }}>
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
        {movies.map(movie => (
          <Link key={movie.movieid} to={`/movie/${movie.movieid}`}>
            <StyledBanner
              src={`/img/${movie.posterimage}`} // Updated to posterimage
              alt={movie.title}
            />
          </Link>
        ))}
      </Carousel>
    </Box>
  );
};

export default Banner;
