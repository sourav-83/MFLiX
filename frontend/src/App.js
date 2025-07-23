// App.js
import './App.css';
import React from 'react';
import Home from './pages/Home'
import CategoryMovies from './pages/CategoryMovies';
import MovieDetails from './pages/MovieDetails'
import SignInSignUp from './pages/SignInSignUp';
import Watchlist from './pages/Watchlist';
import SearchResults from './pages/SearchResults';
import AdvancedSearch from './pages/AdvancedSearch';
import ActorPage from './pages/ActorPage';
import AdminPage from './pages/AdminPage'; 

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import { AuthProvider } from './components/contexts/AuthContext'; 
import LoadingSpinner from './components/common/LoadingSpinner'; // You'll need to create this
import { useAuth } from './components/contexts/AuthContext';
import Profile from './pages/Profile';
import { routePath } from './constants/route';
import AddMovie from './pages/AddMovie';
// Create a separate component for the routes to access AuthContext
const AppRoutes = () => {
  const { loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <Header />
      <Routes>
        <Route path={routePath.home} element={<Home />} />
        <Route path={routePath.categories} element={<CategoryMovies />} />
        <Route path={routePath.movieDetails} element={<MovieDetails />} />
        <Route path={routePath.invalid} element={<Home />} />
        <Route path="/auth" element={<SignInSignUp />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/advanced-search" element={<AdvancedSearch />} />
        <Route path={routePath.profile} element={<Profile />} />
        <Route path="/actor/:actorId" element={<ActorPage />} />
        <Route path="/admin" element={<AdminPage />} /> 
        <Route path="/admin/add-movie" element={<AddMovie />} /> 
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;