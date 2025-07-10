import React, { useState } from 'react';
import {
  Container, Paper, Typography, TextField, FormControl,
  InputLabel, Select, MenuItem, Chip, Box, Button, Grid, Slider,
  CircularProgress, Alert, Autocomplete, Divider
} from '@mui/material';
import {
  Search, FilterList, Clear, Movie, CalendarToday, Star, Category
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import MoviesList from '../components/common/MoviesList';
import { advancedSearchMovies } from '../services/api'; 

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: '#f5f5f5',
}));

const FilterSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2.5),
  '& .MuiFormControl-root': {
    minWidth: 200,
  },
}));

const SearchButton = styled(Button)(({ theme }) => ({
  borderRadius: 25,
  padding: '12px 32px',
  textTransform: 'none',
  fontSize: '1rem',
  fontWeight: 600,
  backgroundColor: '#f5c518',
  color: '#000',
  '&:hover': {
    backgroundColor: '#e4b21b',
    transform: 'translateY(-2px)',
  },
  transition: 'all 0.3s ease',
}));

const AdvancedSearch = () => {
  const [filters, setFilters] = useState({
    query: '',
    genres: [],
    year: [1900, new Date().getFullYear()+3],
    rating: [0, 10],
    sortBy: 'title',
    language: 'any' 
  });

  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const genres = [
    'Drama', 'Comedy', 'Romance', 'Adventure', 'Sci-Fi',
    'Animation', 'Mystery', 'Fantasy', 'History', 'Action',
    'Thriller', 'Horror', 'Crime', 'Documentary', 'Musical'
  ];

  const languages = [
    { value: 'any', label: 'Any Language' }, 
    { value: 'english', label: 'English' },
    { value: 'hindi', label: 'Hindi' },
    { value: 'bengali', label: 'Bengali' },
    { value: 'japanese', label: 'Japanese' },
    { value: 'korean', label: 'Korean' },
    { value: 'spanish', label: 'Spanish' },
    { value: 'french', label: 'French' }
  ];

  const sortOptions = [
    { value: 'title', label: 'Title (A-Z)' },
    { value: 'rating', label: 'Rating (High to Low)' },
    { value: 'release', label: 'Release Date (Newest First)' }
  ];

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const performSearch = async () => {
    
    const hasFilters = 
      filters.query.trim() || 
      filters.genres.length > 0 || 
      filters.language !== 'any' ||
      filters.year[0] !== 1980 || 
      filters.year[1] !== new Date().getFullYear() ||
      filters.rating[0] !== 0 || 
      filters.rating[1] !== 10;

    if (!hasFilters) {
      setError('Please provide at least one search criteria (title, genre, language, year, or rating)');
      return;
    }

    setLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const searchData = {
        query: filters.query.trim() || null, 
        genres: filters.genres.length > 0 ? filters.genres : null,
        yearStart: filters.year[0],
        yearEnd: filters.year[1],
        ratingMin: filters.rating[0],
        ratingMax: filters.rating[1],
        sortBy: filters.sortBy,
        language: filters.language === 'any' ? null : filters.language 
      };

      console.log('Sending search data:', searchData);

      const data = await advancedSearchMovies(searchData);
      console.log('Search results:', data);
      setSearchResults(data || []);
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message || 'Failed to search movies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      genres: [],
      year: [1900, new Date().getFullYear()+3],
      rating: [0, 10],
      sortBy: 'title',
      language: 'any' 
    });
    setSearchResults([]);
    setHasSearched(false);
    setError('');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }} >
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }} >
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: '#f5c518',
            mb: 2
          }}
        >
          Advanced Movie Search
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Find movies with powerful filters and sorting options
        </Typography>
      </Box>

      {/* Filters */}
      <StyledPaper>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 5 }} >
          <FilterList sx={{ mr: 2, color: '#f5c518' }} />
          <Typography variant="h5" fontWeight={600}>
            Search Filters
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Title */}
          <Grid item xs={12} md={6}>
            <FilterSection>
              <TextField
                fullWidth
                label="Movie Title"
                variant="outlined"
                value={filters.query}
                onChange={(e) => handleFilterChange('query', e.target.value)}
                InputProps={{
                  startAdornment: <Movie sx={{ mr: 1, color: 'action.active' }} />
                }}
                placeholder="Enter movie title ..."
              />
            </FilterSection>
          </Grid>

          {/* Language */}
          <Grid item xs={12} md={6}>
            <FilterSection>
              <FormControl fullWidth>
                <InputLabel>Language</InputLabel>
                <Select
                  value={filters.language}
                  label="Language"
                  onChange={(e) => handleFilterChange('language', e.target.value)}
                >
                  {languages.map((lang) => (
                    <MenuItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </FilterSection>
          </Grid>

          {/* Genres */}
          <Grid item xs={12}>
            <FilterSection>
              <Autocomplete
                multiple
                options={genres}
                value={filters.genres}
                onChange={(event, newValue) => handleFilterChange('genres', newValue)}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option}
                      {...getTagProps({ index })}
                      key={option}
                      sx={{ borderRadius: 2 }}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Genres"
                    placeholder="Select genres..."
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <Category sx={{ mr: 1, color: 'action.active' }} />
                          {params.InputProps.startAdornment}
                        </>
                      )
                    }}
                  />
                )}
              />
            </FilterSection>
          </Grid>

          {/* Sort By */}
          <Grid item xs={12} md={12}>
            <FilterSection>
              <FormControl sx={{ minWidth: 250 }}>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={filters.sortBy}
                  label="Sort By"
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                >
                  {sortOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </FilterSection>
          </Grid>

          {/* Release Year - Increased gap */}
          <Grid item xs={12} md={6}>
            <FilterSection sx={{ mb: 8 }}>
              <Typography 
                gutterBottom 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 3,
                  fontSize: '1.1rem',
                  fontWeight: 500
                }}
              >
                <CalendarToday sx={{ mr: 1.5, fontSize: 22, color: '#666' }} />
                Release Year: {filters.year[0]} - {filters.year[1]}
              </Typography>
              <Box sx={{ px: 2, mt: 2 }}>
                <Slider
                  value={filters.year}
                  onChange={(event, newValue) => handleFilterChange('year', newValue)}
                  valueLabelDisplay="auto"
                  min={1900}
                  max={new Date().getFullYear()+3}
                  sx={{ 
                    mt: 2,
                    '& .MuiSlider-thumb': {
                      backgroundColor: '#F5C518',
                      border: 'none',
                      boxShadow: 'none',
                    },
                    '& .MuiSlider-track': {
                      backgroundColor: '#F5C518',
                      border: 'none',
                    },
                    '& .MuiSlider-rail': {
                      backgroundColor: '#ddd',
                    }
                  }}
                />
              </Box>
            </FilterSection>
          </Grid>

          {/* Rating - Increased gap */}
          <Grid item xs={12} md={6}>
            <FilterSection sx={{ mb: 8 }}>
              <Typography 
                gutterBottom 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 3,
                  fontSize: '1.1rem',
                  fontWeight: 500
                }}
              >
                <Star sx={{ mr: 1.5, fontSize: 22, color: '#666' }} />
                Rating: {filters.rating[0]} - {filters.rating[1]}
              </Typography>
              <Box sx={{ px: 2, mt: 2 }}>
                <Slider
                  value={filters.rating}
                  onChange={(event, newValue) => handleFilterChange('rating', newValue)}
                  valueLabelDisplay="auto"
                  min={0}
                  max={10}
                  step={0.1}
                  sx={{ 
                    mt: 2,
                    '& .MuiSlider-thumb': {
                      backgroundColor: '#F5C518',
                      border: 'none',
                      boxShadow: 'none',
                    },
                    '& .MuiSlider-track': {
                      backgroundColor: '#F5C518',
                      border: 'none',
                    },
                    '& .MuiSlider-rail': {
                      backgroundColor: '#ddd',
                    }
                  }}
                />
              </Box>
            </FilterSection>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <SearchButton
            variant="contained"
            size="large"
            onClick={performSearch}
            startIcon={<Search />}
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search Movies'}
          </SearchButton>
          <Button
            variant="outlined"
            size="large"
            onClick={clearFilters}
            startIcon={<Clear />}
            sx={{ borderRadius: 25, px: 3 }}
          >
            Clear Filters
          </Button>
        </Box>
      </StyledPaper>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={60} />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* No Results State */}
      {hasSearched && !loading && searchResults.length === 0 && !error && (
        <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
          No movies found matching your criteria. Try adjusting your filters.
        </Alert>
      )}

      {/* Search Results using MoviesList */}
      {searchResults.length > 0 && (
        <StyledPaper>
          <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
            Search Results ({searchResults.length} movies found)
          </Typography>
          <MoviesList movies={searchResults} />
        </StyledPaper>
      )}
    </Container>
  );
};

export default AdvancedSearch;