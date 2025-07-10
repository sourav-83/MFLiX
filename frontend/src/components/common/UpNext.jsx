import { Typography } from "@mui/material";
import { Box, styled } from '@mui/material';
import { Link } from 'react-router-dom';

const Component = styled(Box)`
  width: 40%;
  display: flex;
  flex-direction: column;
  align-items: baseline;
  padding-left: 20px;
  & > p {
    color: #F5C518;
    font-weight: 600;
    font-size: 18px;
    margin-bottom: 10px;
  }
`;

const Wrapper = styled(Box)`
  color: #FFFFFF;
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  & > p {
    margin-left: 20px;
  }
`;

const Poster = styled('img')({
  width: '88px',
  height: '130px',
  objectFit: 'cover',
  borderRadius: '6px',
});


const UpNext = ({ movies }) => {
  return (
    <Component>
      <Typography>Up Next</Typography>
      {movies.slice(0, 3).map(movie => (
        <Link key={movie.movieid} to={`/movie/${movie.movieid}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <Wrapper>
            <Poster src={`/img/${movie.titleimage}`} alt={movie.title} /> {/* Updated to titleimage */}
            <Typography>{movie.title}</Typography>
          </Wrapper>
        </Link>
      ))}
    </Component>
  );
};

export default UpNext;
