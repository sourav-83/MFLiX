// src/services/api.js
import axios from 'axios';
import url from '../constants/url';

export const categoryMovies = async (API_URL) => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.log('Error while calling the API:', error.message);
    return error.response?.data;
  }
};

export const searchMovies = async (query) => {
  try {
    const response = await axios.get(`${url}/api/movies/search?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.log('Error while searching movies:', error.message);
    return [];
  }
};

export const advancedSearchMovies = async (filters) => {
  try {
    const response = await axios.post(`${url}/api/movies/advanced-search`, filters);
    return response.data;
  } catch (error) {
    console.log('Error while performing advanced search:', error.message);
    return [];
  }
};

