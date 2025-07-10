// SearchResults.jsx
import Header from '../components/common/Header';
import { searchMovies } from '../services/api';

import { Box, styled, Typography, Divider } from '@mui/material';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import MoviesList from '../components/common/MoviesList';

const Component = styled(Box)`
  width: 80%;
  margin: auto;
`;

const Container = styled(Box)`
  background: #121212;
  padding: 20px;
  color: white;
`;

const SearchResults = () => {
  const [movies, setMovies] = useState([]);
  const { search } = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(search).get('q');
    if (!query) return;

    const fetchResults = async () => {
      try {
        const response = await searchMovies(query);
        setMovies(response || []);
      } catch (error) {
        console.error('Failed to fetch search results:', error);
      }
    };

    fetchResults();
  }, [search]);

  return (
    <>
     
      <Component>
        <Container>
          <Typography variant="h4">Search Results</Typography>
          <Typography style={{ fontSize: 12, margin: 5 }}>
            {movies.length} result(s) found
          </Typography>
          <Divider style={{ backgroundColor: '#444' }} />
          <MoviesList movies={movies} />
        </Container>
      </Component>
    </>
  );
};

export default SearchResults;
