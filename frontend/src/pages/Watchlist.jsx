import { useEffect, useState } from "react";
import axios from "axios";
import MoviesList from "../components/common/MoviesList";
import { Typography, Container } from "@mui/material";
import url from "../constants/url";
import { useAuth } from "../components/contexts/AuthContext";

const Watchlist = () => {
  const [movies, setMovies] = useState([]);
  const [watchlistName, setWatchlistName] = useState("Your Watchlist");
  const { user, isAuthenticated } = useAuth(); // Get user and auth status

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        // Get token from localStorage or AuthContext
        const token = user?.token || localStorage.getItem('token');

        
        if (!token) {
          console.log("No token found, user not authenticated");
          setMovies([]);
          return;
        }

        // Make request with Authorization header
        const response = await axios.get(`${url}/api/users/watchlist`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        // Debug logs
        console.log("Full response:", response.data);
        console.log("Response type:", typeof response.data);
        console.log("Is array:", Array.isArray(response.data));

        // Handle the actual response structure
        let moviesData = [];
        let watchlistNameData = "Your Watchlist";

        if (Array.isArray(response.data)) {
          // If response.data is directly an array of movies
          moviesData = response.data;
        } else if (response.data && Array.isArray(response.data.movies)) {
          // If response.data has a movies property
          moviesData = response.data.movies;
          watchlistNameData = response.data.name || "Your Watchlist";
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          // If nested in data property
          moviesData = response.data.data;
        }

        console.log("Movies to set:", moviesData);
        console.log("Movies length:", moviesData.length);

        setMovies(moviesData);
        setWatchlistName(watchlistNameData);

      } catch (error) {
        console.error("Failed to fetch watchlist:", error);

        if (error.response?.status === 401) {
          console.log("User not authenticated, clearing local storage");
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }

        setMovies([]);
      }
    };

    // Only fetch if user is authenticated
    if (isAuthenticated) {
      fetchWatchlist();
    }
  }, [isAuthenticated, user]);

  // Debug log for movies state
  console.log("Current movies state:", movies);
  console.log("Movies state length:", movies.length);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ color: '#fff' }}>
        {watchlistName}
      </Typography>
      {movies.length === 0 ? (
        <Typography sx={{ color: '#fff', mt: 2 }}>
          No movies in watchlist
        </Typography>
      ) : (
        <MoviesList movies={movies} />
      )}
    </Container>
  );
};

export default Watchlist;