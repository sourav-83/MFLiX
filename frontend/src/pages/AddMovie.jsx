// AddMovie.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  Alert,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Autocomplete,
  Card,
  CardMedia,
  Divider,
  FormHelperText,
  CircularProgress as MuiCircularProgress,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import MovieIcon from '@mui/icons-material/Movie';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import PersonIcon from '@mui/icons-material/Person';
import BookIcon from '@mui/icons-material/Book';
import ImageIcon from '@mui/icons-material/Image';
import CakeIcon from '@mui/icons-material/Cake';
import PublicIcon from '@mui/icons-material/Public';
import InfoIcon from '@mui/icons-material/Info';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';

import axios from 'axios';
import url from '../constants/url'; 
import { useAuth } from '../components/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';

// --- Styled Components ---
const StyledContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: '#f5f5f5',
  minHeight: '100vh',
}));

const FormPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: 'white',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
  border: '1px solid #e0e0e0',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.4rem',
  fontWeight: 700,
  marginBottom: theme.spacing(3),
  color: '#333',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  borderBottom: `2px solid ${theme.palette.primary.light}`,
  paddingBottom: theme.spacing(1),
}));

const BackButton = styled(Button)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  color: theme.palette.text.secondary,
  borderColor: theme.palette.grey[300],
  '&:hover': {
    backgroundColor: theme.palette.grey[100],
  },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(1.5, 4),
  fontSize: '1rem',
  fontWeight: 600,
  borderRadius: theme.shape.borderRadius * 2,
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
  '&:hover': {
    background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
  },
}));

const ImagePreview = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 250,
  height: 350,
  margin: '16px auto',
  border: `2px dashed ${theme.palette.grey[400]}`,
  borderRadius: theme.shape.borderRadius,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  backgroundColor: theme.palette.grey[50],
  overflow: 'hidden',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.lightest,
  },
}));

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: 'none',
  '&:before': {
    display: 'none',
  },
  '&.Mui-expanded': {
    margin: 'auto',
  },
  '&.Mui-expanded:first-of-type': {
    marginTop: theme.spacing(2),
  },
  '&.Mui-expanded:last-of-type': {
    marginBottom: theme.spacing(2),
  },
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.contrastText,
  borderRadius: `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0`,
  minHeight: 56,
  '& .MuiAccordionSummary-content': {
    margin: theme.spacing(1.5, 0),
    fontWeight: 600,
  },
  '&.Mui-expanded': {
    minHeight: 56,
  },
}));

const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  padding: theme.spacing(3),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

// --- Main Component ---
const AddMovie = () => {
  const [formData, setFormData] = useState({
    title: '',
    synopsis: '',
    releaseDate: '',
    duration: '',
    language: '',
    posterImage: '',
    
    trailerUrl: '',
    trailerTitle: '',
    trailerReleaseDate: '',
    trailerDuration: '',

    genres: [],
    directors: [],
    actors: [],
    writers: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Dynamic lists from backend
  const [availableGenres, setAvailableGenres] = useState([]);
  const [availableLanguages, setAvailableLanguages] = useState([]);

  // Autocomplete suggestions and loading states
  const [actorSuggestions, setActorSuggestions] = useState([]);
  const [directorSuggestions, setDirectorSuggestions] = useState([]);
  const [writerSuggestions, setWriterSuggestions] = useState([]);
  
  const [loadingSuggestions, setLoadingSuggestions] = useState({
    actors: false,
    directors: false,
    writers: false,
  });

  const [posterPreview, setPosterPreview] = useState('');

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated and fetch initial data
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    const fetchInitialData = async () => {
      try {
        // Updated endpoints for genres and languages
        const [genresRes, languagesRes] = await Promise.all([
          axios.get(`${url}/api/content-management/genres`),
          axios.get(`${url}/api/content-management/languages`),
        ]);
        setAvailableGenres(genresRes.data.map(g => g.genreName)); // Ensure genreName is correctly mapped
        setAvailableLanguages(languagesRes.data);
      } catch (err) {
        console.error('Error fetching initial data:', err);
        setError('Failed to load genres or languages. Please refresh.');
      }
    };

    fetchInitialData();
  }, [isAuthenticated, navigate]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (field === 'posterImage') {
      setPosterPreview(value);
    }
  };

  const fetchSuggestions = useCallback(
    debounce(async (query, type) => {
      if (!query.trim()) {
        if (type === 'actors') setActorSuggestions([]);
        if (type === 'directors') setDirectorSuggestions([]);
        if (type === 'writers') setWriterSuggestions([]);
        return;
      }

      setLoadingSuggestions(prev => ({ ...prev, [type]: true }));
      try {
        // Updated search endpoints for actors, directors, writers
        const endpoint = `${url}/api/content-management/${type}/search?name=${encodeURIComponent(query)}`;
        const response = await axios.get(endpoint);
        if (type === 'actors') setActorSuggestions(response.data);
        if (type === 'directors') setDirectorSuggestions(response.data);
        if (type === 'writers') setWriterSuggestions(response.data);
      } catch (err) {
        console.error(`Error fetching ${type} suggestions:`, err);
        if (type === 'actors') setActorSuggestions([]);
        if (type === 'directors') setDirectorSuggestions([]);
        if (type === 'writers') setWriterSuggestions([]);
      } finally {
        setLoadingSuggestions(prev => ({ ...prev, [type]: false }));
      }
    }, 300),
    []
  );

  const handleAutocompleteChange = (type, newValue) => {
    setFormData(prev => ({
      ...prev,
      [type]: newValue,
    }));
  };

  const handlePersonDetailChange = (type, index, field, value) => {
    setFormData(prev => {
      const updatedList = [...prev[type]];
      updatedList[index] = {
        ...updatedList[index],
        [field]: value,
      };
      return {
        ...prev,
        [type]: updatedList,
      };
    });
  };

  const validateForm = () => {
    setError(''); // Reset error message at the start of validation

    const requiredMovieFields = ['title', 'synopsis', 'releaseDate'];
    const missingMovieFields = requiredMovieFields.filter(field => !formData[field]?.trim());
    
    if (missingMovieFields.length > 0) {
      setError(`Please fill in the following required movie details: ${missingMovieFields.map(f => {
          if (f === 'synopsis') return 'Synopsis';
          if (f === 'title') return 'Title';
          if (f === 'releaseDate') return 'Release Date';
          return f;
      }).join(', ')}.`);
      return false;
    }

    if (formData.genres.length === 0) {
        setError('Please select at least one genre for the movie.');
        return false;
    }
    if (formData.directors.length === 0) {
        setError('Please add at least one director for the movie.');
        return false;
    }
    
    const movieReleaseDate = new Date(formData.releaseDate);
    if (isNaN(movieReleaseDate.getTime())) {
      setError('Please enter a valid release date for the movie.');
      return false;
    }

    if (formData.duration && (isNaN(formData.duration) || parseInt(formData.duration) <= 0)) {
      setError('Movie duration must be a positive number (in minutes).');
      return false;
    }

    if (formData.trailerUrl?.trim()) {
        if (!formData.trailerTitle?.trim()) {
            setError('Please provide a title for the movie trailer.');
            return false;
        }
        if (!formData.trailerReleaseDate?.trim()) {
            setError('Please provide a release date for the movie trailer.');
            return false;
        }
        const trailerReleaseDate = new Date(formData.trailerReleaseDate);
        if (isNaN(trailerReleaseDate.getTime())) {
            setError('Please enter a valid release date for the trailer.');
            return false;
        }
        if (formData.trailerDuration && (isNaN(formData.trailerDuration) || parseInt(formData.trailerDuration) <= 0)) {
            setError('Trailer duration must be a positive number (in minutes).');
            return false;
        }
    }

    const validatePersonDetails = (personList, type) => {
      for (const person of personList) {
        if (person.isNew) {
          if (person.dateOfBirth && isNaN(new Date(person.dateOfBirth).getTime())) {
            setError(`Invalid Date of Birth for new ${type} "${person.name}".`);
            return false;
          }
        }
      }
      return true;
    };

    if (!validatePersonDetails(formData.actors, 'actor')) return false;
    if (!validatePersonDetails(formData.directors, 'director')) return false;
    if (!validatePersonDetails(formData.writers, 'writer')) return false;

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const movieData = {
        title: formData.title,
        synopsis: formData.synopsis,
        releaseDate: formData.releaseDate,
        duration: formData.duration ? parseInt(formData.duration) : null,
        language: formData.language || null,
        posterImage: formData.posterImage || null,
        
        trailer: formData.trailerUrl.trim() ? {
          title: formData.trailerTitle,
          url: formData.trailerUrl,
          releaseDate: formData.trailerReleaseDate,
          duration: formData.trailerDuration ? parseInt(formData.trailerDuration) : null,
        } : null,

        genres: formData.genres,
        directors: formData.directors.map(d => ({
          id: d.id,
          name: d.name,
          isNew: d.isNew,
          image: d.image || null,
          dateOfBirth: d.dateOfBirth || null,
          nationality: d.nationality || null,
          bio: d.bio || null,
        })),
        actors: formData.actors.map(a => ({
          id: a.id,
          name: a.name,
          roleName: a.roleName,
          isNew: a.isNew,
          image: a.image || null,
          dateOfBirth: a.dateOfBirth || null,
          nationality: a.nationality || null,
          bio: a.bio || null,
        })),
        writers: formData.writers.map(w => ({
          id: w.id,
          name: w.name,
          isNew: w.isNew,
          image: w.image || null,
          dateOfBirth: w.dateOfBirth || null,
          nationality: w.nationality || null,
          bio: w.bio || null,
        })),
      };

      // Updated endpoint for adding a movie
      const response = await axios.post(`${url}/api/content-management/movies/add`, movieData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setSuccess('Movie added successfully!');
      setTimeout(() => {
        navigate('/admin');
      }, 2000);

    } catch (err) {
      console.error('Error adding movie:', err);
      setError(err.response?.data?.message || 'Failed to add movie. An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/admin');
  };

  // Helper function to render Autocomplete for Directors/Writers
  const renderPersonAutocomplete = (type, suggestions, loadingStatus, label, helperText, isRequired = false) => (
    <Autocomplete
      multiple
      options={suggestions}
      getOptionLabel={(option) => {
        if (typeof option === 'object' && option !== null && option.name) {
          return option.name;
        }
        return String(option);
      }}
      filterOptions={(options, state) => {
        const filtered = options.filter(option => 
          (typeof option === 'object' && option.name ? option.name : String(option)).toLowerCase().includes(state.inputValue.toLowerCase())
        );
        if (state.inputValue !== '' && !filtered.some(opt => 
            (typeof opt === 'object' && opt.name ? opt.name : String(opt)).toLowerCase() === state.inputValue.toLowerCase()
        )) {
          filtered.push({
            name: state.inputValue,
            isNew: true,
          });
        }
        return filtered;
      }}
      value={formData[type]}
      onChange={(event, newValue) => {
        const processedValue = newValue.map(item => {
          if (item.isNew && !item.image) {
            return { ...item, image: '', dateOfBirth: '', nationality: '', bio: '' };
          }
          return item;
        });
        handleAutocompleteChange(type, processedValue);
      }}
      onInputChange={(event, newInputValue) => {
        fetchSuggestions(newInputValue, type);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={`Search for or add ${type}`}
          variant="outlined"
          required={isRequired && formData[type].length === 0}
          error={isRequired && formData[type].length === 0 && !!error}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loadingStatus ? <MuiCircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          helperText={helperText}
        />
      )}
      renderOption={(props, option) => (
        <li {...props}>
          {option.isNew ? `Add "${option.name}" (New)` : option.name}
        </li>
      )}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      freeSolo
    />
  );

  return (
    <StyledContainer maxWidth="md">
      <BackButton
        startIcon={<ArrowBackIcon />}
        onClick={handleBack}
        variant="outlined"
      >
        Back to Admin Panel
      </BackButton>

      <FormPaper>
        <Box display="flex" alignItems="center" mb={4}>
          <MovieIcon sx={{ fontSize: 40, color: '#667eea', mr: 2 }} />
          <Typography variant="h4" component="h1" fontWeight="bold" sx={{ color: '#333' }}>
            Add New Movie
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, boxShadow: '0 2px 8px rgba(255,0,0,0.1)' }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3, boxShadow: '0 2px 8px rgba(0,128,0,0.1)' }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            {/* --- Basic Movie Details --- */}
            <Grid item xs={12}>
              <SectionTitle>
                <MovieIcon fontSize="inherit" /> Movie Details
              </SectionTitle>
            </Grid>

            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Movie Title *"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                variant="outlined"
                required
                helperText="Enter the full title of the movie (e.g., 'The Matrix')."
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Release Date *"
                type="date"
                value={formData.releaseDate}
                onChange={(e) => handleInputChange('releaseDate', e.target.value)}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                required
                helperText="Theatrical release date."
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Synopsis *"
                value={formData.synopsis}
                onChange={(e) => handleInputChange('synopsis', e.target.value)}
                variant="outlined"
                multiline
                rows={5}
                required
                helperText="Provide a brief summary of the movie's plot."
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={formData.genres.length === 0 && !!error}>
                <InputLabel id="genres-select-label">Genre(s) *</InputLabel>
                <Select
                  labelId="genres-select-label"
                  multiple
                  value={formData.genres}
                  onChange={(e) => handleInputChange('genres', e.target.value)}
                  label="Genre(s) *"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} onDelete={() => handleInputChange('genres', formData.genres.filter(g => g !== value))} />
                      ))}
                    </Box>
                  )}
                >
                  {availableGenres.map((genre) => (
                    <MenuItem key={genre} value={genre}>
                      {genre}
                    </MenuItem>
                  ))}
                </Select>
                {formData.genres.length === 0 && (
                  <FormHelperText error>At least one genre is required.</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Duration (minutes)"
                type="number"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                variant="outlined"
                inputProps={{ min: 1 }}
                helperText="Movie running time in minutes (e.g., 120)."
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="language-select-label">Language</InputLabel>
                <Select
                  labelId="language-select-label"
                  value={formData.language}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                  label="Language"
                  helperText="Primary language of the movie."
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  {availableLanguages.map((language) => (
                    <MenuItem key={language} value={language}>
                      {language}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* --- Cast & Crew --- */}
            <Grid item xs={12}>
              <Divider sx={{ my: 4 }} />
              <SectionTitle>
                <PersonIcon fontSize="inherit" /> Cast & Crew
              </SectionTitle>
            </Grid>

            {/* Directors Autocomplete and Details */}
            <Grid item xs={12}>
              {renderPersonAutocomplete(
                'directors',
                directorSuggestions,
                loadingSuggestions.directors,
                'Director(s) *',
                'Type to search for existing directors or enter a new name to add them. (Press Enter)',
                true // isRequired
              )}
               {formData.directors.length === 0 && (
                <FormHelperText error sx={{ ml: 1 }}>
                  At least one director is required.
                </FormHelperText>
              )}
              {formData.directors.filter(d => d.isNew).map((director, index) => (
                <StyledAccordion key={`new_director_${director.name}_${index}`} sx={{ mt: 2 }}>
                  <StyledAccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: '#e8f0fe', color: '#1a237e' }}>
                    <Typography>Details for New Director: **{director.name}**</Typography>
                  </StyledAccordionSummary>
                  <StyledAccordionDetails sx={{ backgroundColor: '#f0f4f8' }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          label="Image URL"
                          value={director.image || ''}
                          onChange={(e) => handlePersonDetailChange('directors', formData.directors.indexOf(director), 'image', e.target.value)}
                          variant="outlined"
                          fullWidth
                          InputProps={{ startAdornment: <InputAdornment position="start"><ImageIcon color="action" /></InputAdornment> }}
                          helperText="Link to the director's profile image."
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Date of Birth"
                          type="date"
                          value={director.dateOfBirth || ''}
                          onChange={(e) => handlePersonDetailChange('directors', formData.directors.indexOf(director), 'dateOfBirth', e.target.value)}
                          variant="outlined"
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                          InputProps={{ startAdornment: <InputAdornment position="start"><CakeIcon color="action" /></InputAdornment> }}
                          helperText="Director's date of birth."
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Nationality"
                          value={director.nationality || ''}
                          onChange={(e) => handlePersonDetailChange('directors', formData.directors.indexOf(director), 'nationality', e.target.value)}
                          variant="outlined"
                          fullWidth
                          InputProps={{ startAdornment: <InputAdornment position="start"><PublicIcon color="action" /></InputAdornment> }}
                          helperText="Country of origin."
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Biography"
                          value={director.bio || ''}
                          onChange={(e) => handlePersonDetailChange('directors', formData.directors.indexOf(director), 'bio', e.target.value)}
                          variant="outlined"
                          fullWidth
                          multiline
                          rows={3}
                          InputProps={{ startAdornment: <InputAdornment position="start"><InfoIcon color="action" /></InputAdornment> }}
                          helperText="A brief biography of the director."
                        />
                      </Grid>
                    </Grid>
                  </StyledAccordionDetails>
                </StyledAccordion>
              ))}
            </Grid>

            {/* Writers Autocomplete and Details */}
            <Grid item xs={12}>
              {renderPersonAutocomplete(
                'writers',
                writerSuggestions,
                loadingSuggestions.writers,
                'Writer(s)',
                'Type to search for existing writers or enter a new name to add them. (Press Enter)'
              )}
              {formData.writers.filter(w => w.isNew).map((writer, index) => (
                <StyledAccordion key={`new_writer_${writer.name}_${index}`} sx={{ mt: 2 }}>
                  <StyledAccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: '#e8f0fe', color: '#1a237e' }}>
                    <Typography>Details for New Writer: **{writer.name}**</Typography>
                  </StyledAccordionSummary>
                  <StyledAccordionDetails sx={{ backgroundColor: '#f0f4f8' }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          label="Image URL"
                          value={writer.image || ''}
                          onChange={(e) => handlePersonDetailChange('writers', formData.writers.indexOf(writer), 'image', e.target.value)}
                          variant="outlined"
                          fullWidth
                          InputProps={{ startAdornment: <InputAdornment position="start"><ImageIcon color="action" /></InputAdornment> }}
                          helperText="Link to the writer's profile image."
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Date of Birth"
                          type="date"
                          value={writer.dateOfBirth || ''}
                          onChange={(e) => handlePersonDetailChange('writers', formData.writers.indexOf(writer), 'dateOfBirth', e.target.value)}
                          variant="outlined"
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                          InputProps={{ startAdornment: <InputAdornment position="start"><CakeIcon color="action" /></InputAdornment> }}
                          helperText="Writer's date of birth."
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Nationality"
                          value={writer.nationality || ''}
                          onChange={(e) => handlePersonDetailChange('writers', formData.writers.indexOf(writer), 'nationality', e.target.value)}
                          variant="outlined"
                          fullWidth
                          InputProps={{ startAdornment: <InputAdornment position="start"><PublicIcon color="action" /></InputAdornment> }}
                          helperText="Country of origin."
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Biography"
                          value={writer.bio || ''}
                          onChange={(e) => handlePersonDetailChange('writers', formData.writers.indexOf(writer), 'bio', e.target.value)}
                          variant="outlined"
                          fullWidth
                          multiline
                          rows={3}
                          InputProps={{ startAdornment: <InputAdornment position="start"><InfoIcon color="action" /></InputAdornment> }}
                          helperText="A brief biography of the writer."
                        />
                      </Grid>
                    </Grid>
                  </StyledAccordionDetails>
                </StyledAccordion>
              ))}
            </Grid>

            {/* Actors Autocomplete with Role Name and Details */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mt: 3, mb: 2, fontWeight: 'medium', color: '#555' }}>
                Add Cast Members and their Roles:
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                <Autocomplete
                  options={actorSuggestions}
                  getOptionLabel={(option) => {
                    if (typeof option === 'object' && option !== null && option.name) {
                      return option.name;
                    }
                    return String(option);
                  }}
                  filterOptions={(options, state) => {
                    const filtered = options.filter(option => 
                      (typeof option === 'object' && option.name ? option.name : String(option)).toLowerCase().includes(state.inputValue.toLowerCase())
                    );
                    if (state.inputValue !== '' && !filtered.some(opt => 
                        (typeof opt === 'object' && opt.name ? opt.name : String(opt)).toLowerCase() === state.inputValue.toLowerCase()
                    )) {
                      filtered.push({
                        name: state.inputValue,
                        isNew: true,
                      });
                    }
                    return filtered;
                  }}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      // Ensure newValue is always treated as an object for consistency
                      const processedValue = {
                          id: newValue.id || null, // ID will be null for new actors
                          name: newValue.name || newValue, // Take name from object or fallback to string
                          roleName: '', // Role starts empty, user fills it
                          isNew: newValue.isNew || false,
                          image: '', dateOfBirth: '', nationality: '', bio: '', // Initialize for new actors
                      };
                      setFormData(prev => ({
                          ...prev,
                          actors: [...prev.actors, processedValue]
                      }));
                      setActorSuggestions([]); // Clear suggestions to reset input field
                    }
                  }}
                  onInputChange={(event, newInputValue) => {
                    fetchSuggestions(newInputValue, 'actors');
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Actor Name"
                      placeholder="Search for or add an actor"
                      variant="outlined"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loadingSuggestions.actors ? <MuiCircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                      helperText="Type to search for existing actors or enter a new name. Added actors appear below with role fields."
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props}>
                      {option.isNew ? `Add "${option.name}" (New)` : option.name}
                    </li>
                  )}
                  selectOnFocus
                  clearOnBlur
                  handleHomeEndKeys
                  freeSolo
                />

                {/* Display added actors with their roles and details if new using Accordion */}
                <Box mt={2} display="flex" flexDirection="column" gap={2}>
                  {formData.actors.map((actor, index) => (
                    <StyledAccordion key={`actor_${actor.name}_${index}`} sx={{ borderLeft: actor.isNew ? '4px solid #4caf50' : 'none' }}>
                      <StyledAccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: actor.isNew ? '#e8f5e9' : '#fafafa', color: '#333' }}>
                        <Box display="flex" alignItems="center" width="100%" pr={2}>
                          <Typography flexGrow={1}>
                            Actor: **{actor.name}**
                            {actor.isNew && <Chip label="NEW" size="small" color="success" sx={{ ml: 1, height: 20 }} />}
                          </Typography>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAutocompleteChange('actors', formData.actors.filter((_, i) => i !== index));
                            }}
                            size="small"
                          >
                            <DeleteIcon color="error" />
                          </IconButton>
                        </Box>
                      </StyledAccordionSummary>
                      <StyledAccordionDetails sx={{ backgroundColor: '#f0f4f8' }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <TextField
                              label="Role Name *"
                              value={actor.roleName}
                              onChange={(e) => handlePersonDetailChange('actors', index, 'roleName', e.target.value)}
                              variant="outlined"
                              fullWidth
                              required
                              placeholder="e.g., John Wick, Hermione Granger"
                              helperText="The character name played by this actor."
                            />
                          </Grid>
                          {actor.isNew && (
                            <>
                              <Grid item xs={12}>
                                <TextField
                                  label="Actor Image URL"
                                  value={actor.image || ''}
                                  onChange={(e) => handlePersonDetailChange('actors', index, 'image', e.target.value)}
                                  variant="outlined"
                                  fullWidth
                                  InputProps={{ startAdornment: <InputAdornment position="start"><ImageIcon color="action" /></InputAdornment> }}
                                  helperText="Link to the actor's profile image."
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  label="Date of Birth"
                                  type="date"
                                  value={actor.dateOfBirth || ''}
                                  onChange={(e) => handlePersonDetailChange('actors', index, 'dateOfBirth', e.target.value)}
                                  variant="outlined"
                                  fullWidth
                                  InputLabelProps={{ shrink: true }}
                                  InputProps={{ startAdornment: <InputAdornment position="start"><CakeIcon color="action" /></InputAdornment> }}
                                  helperText="Actor's date of birth."
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  label="Nationality"
                                  value={actor.nationality || ''}
                                  onChange={(e) => handlePersonDetailChange('actors', index, 'nationality', e.target.value)}
                                  variant="outlined"
                                  fullWidth
                                  InputProps={{ startAdornment: <InputAdornment position="start"><PublicIcon color="action" /></InputAdornment> }}
                                  helperText="Country of origin."
                                />
                              </Grid>
                              <Grid item xs={12}>
                                <TextField
                                  label="Biography"
                                  value={actor.bio || ''}
                                  onChange={(e) => handlePersonDetailChange('actors', index, 'bio', e.target.value)}
                                  variant="outlined"
                                  fullWidth
                                  multiline
                                  rows={3}
                                  InputProps={{ startAdornment: <InputAdornment position="start"><InfoIcon color="action" /></InputAdornment> }}
                                  helperText="A brief biography of the actor."
                                />
                              </Grid>
                            </>
                          )}
                        </Grid>
                      </StyledAccordionDetails>
                    </StyledAccordion>
                  ))}
                </Box>
              </Box>
            </Grid>
            

            {/* --- Media & Images --- */}
            <Grid item xs={12}>
              <Divider sx={{ my: 4 }} />
              <SectionTitle>
                <AddPhotoAlternateIcon fontSize="inherit" /> Media & Images
              </SectionTitle>
            </Grid>

            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Poster Image URL"
                value={formData.posterImage}
                onChange={(e) => handleInputChange('posterImage', e.target.value)}
                variant="outlined"
                placeholder="https://example.com/movie-poster.jpg"
                helperText="Direct URL to the movie's main poster image."
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <ImagePreview>
                {posterPreview ? (
                  <CardMedia
                    component="img"
                    height="100%"
                    image={posterPreview}
                    alt="Poster Preview"
                    onError={() => setPosterPreview('')}
                    sx={{ objectFit: 'contain' }}
                  />
                ) : (
                  <Box textAlign="center" color="#999">
                    <AddPhotoAlternateIcon sx={{ fontSize: 60, mb: 1 }} />
                    <Typography variant="body2">
                      Poster Preview
                    </Typography>
                    <Typography variant="caption" display="block">
                      (Enter a URL above)
                    </Typography>
                  </Box>
                )}
              </ImagePreview>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Trailer URL"
                value={formData.trailerUrl}
                onChange={(e) => handleInputChange('trailerUrl', e.target.value)}
                variant="outlined"
                placeholder="https://www.youtube.com/watch?v=..."
                helperText="Direct URL to the movie's official trailer (e.g., YouTube link)."
              />
            </Grid>

            {/* Trailer Details (conditionally rendered if Trailer URL is provided) */}
            {formData.trailerUrl && (
                <>
                    <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle1" fontWeight="bold" mb={2} color="#555">
                            Trailer Specifics (Optional but Recommended)
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Trailer Title *"
                            value={formData.trailerTitle}
                            onChange={(e) => handleInputChange('trailerTitle', e.target.value)}
                            variant="outlined"
                            required
                            helperText="e.g., Official Trailer #1, Teaser Trailer"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Trailer Release Date *"
                            type="date"
                            value={formData.trailerReleaseDate}
                            onChange={(e) => handleInputChange('trailerReleaseDate', e.target.value)}
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            required
                            helperText="When the trailer was first released."
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Trailer Duration (minutes)"
                            type="number"
                            value={formData.trailerDuration}
                            onChange={(e) => handleInputChange('trailerDuration', e.target.value)}
                            variant="outlined"
                            inputProps={{ min: 1 }}
                            helperText="Running time of the trailer in minutes."
                        />
                    </Grid>
                </>
            )}

            {/* --- Submit Button --- */}
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center" mt={3}>
                <SubmitButton
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={loading ? <MuiCircularProgress size={20} color="inherit" /> : <SaveIcon />}
                  disabled={loading}
                >
                  {loading ? 'Adding Movie...' : 'Add Movie'}
                </SubmitButton>
              </Box>
            </Grid>
          </Grid>
        </form>
      </FormPaper>
    </StyledContainer>
  );
};

export default AddMovie;