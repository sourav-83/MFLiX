// Header.jsx
import { useState, useEffect, useRef } from 'react';
import { 
  AppBar, 
  Toolbar, 
  styled, 
  Box, 
  Typography, 
  InputBase, 
  Menu, 
  MenuItem, 
  Avatar,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemButton
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SearchIcon from '@mui/icons-material/Search';
import { logoURL } from '../../constants/constant';
import { useNavigate } from 'react-router-dom';
import { routePath } from '../../constants/route';
import HeaderMenu from './HeaderMenu';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import url from '../../constants/url';

const StyledToolBar = styled(Toolbar)`
  background: #121212;
  min-height: 56px !important;
  padding: 0 115px !important;
  justify-content: space-between;
  & > div {
    display: flex;
    align-items: center;
    cursor: pointer;
    & > * {
      padding: 0 2px;
    }
    & > p {
      font-size: 14px;
      font-weight: 600;
    }
  }
  & > p {
    font-size: 14px;
    font-weight: 600;
  }
`;

const SearchContainer = styled(Box)`
  position: relative;
  width: 50%;
`;

const InputSearchField = styled(InputBase)`
  background: #FFFFFF;
  height: 30px;
  width: 100%;
  border-radius: 5px;
  padding-left: 10px;
  padding-right: 35px;
`;

const SearchIconContainer = styled(Box)`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  pointer-events: none;
`;

const SuggestionsPaper = styled(Paper)`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: #1c1c1c;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  margin-top: 2px;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
`;

const SuggestionItem = styled(ListItem)`
  padding: 8px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const SuggestionText = styled(Typography)`
  color: white;
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Logo = styled('img')({
  width: 64
});

const ProfileSection = styled(Box)`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const ProfileAvatar = styled(Avatar)`
  width: 22px;
  height: 24px;
  background-color: #FFEE86;
  font-size: 14px;
  font-weight: bold;
  color: #000000;
  margin-right: 8px;
`;

const Username = styled(Typography)`
  font-size: 14px;
  font-weight: 600;
  color: white;
  margin-right: 4px;
`;

const StyledMenu = styled(Menu)`
  & .MuiPaper-root {
    background-color: #1c1c1c;
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.1);
    min-width: 160px;
  }

  & .MuiMenuItem-root {
    padding: 6px 12px;
    font-size: 13px;
    
    & .MuiListItemIcon-root {
      min-width: 30px;
    }

    & .MuiSvgIcon-root {
      font-size: 18px;
    }

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }

  & .MuiListItemText-primary {
    font-size: 13px;
  }
`;

const Header = () => {
  const [open, setOpen] = useState(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCheckLoading, setAdminCheckLoading] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const suggestionsTimeoutRef = useRef(null);

  const handleClick = (e) => {
    setOpen(e.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  // Check admin status when profile menu is clicked
  const handleProfileClick = async (e) => {
    setProfileMenuOpen(e.currentTarget);
    
    // Check admin status if user is authenticated and we haven't checked yet
    if (isAuthenticated && !adminCheckLoading) {
      await checkAdminStatus();
    }
  };

  const handleProfileClose = () => {
    setProfileMenuOpen(null);
  };

  // Function to check if user is admin
  const checkAdminStatus = async () => {
    try {
      setAdminCheckLoading(true);
      const response = await axios.get(`${url}/api/user/is_admin`);
      
      // Assuming the backend returns { isAdmin: true/false } or { admin: true/false }
      const adminStatus = response.data.isAdmin || response.data.admin || false;
      setIsAdmin(adminStatus);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    } finally {
      setAdminCheckLoading(false);
    }
  };

  // Function to fetch search suggestions
  const fetchSuggestions = async (query) => {
    if (!query.trim() || query.length < 1) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await axios.get(`${url}/api/movies/suggestions?q=${encodeURIComponent(query)}`);
      setSuggestions(response.data || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Debounced search function
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Clear previous timeout
    if (suggestionsTimeoutRef.current) {
      clearTimeout(suggestionsTimeoutRef.current);
    }

    // Set new timeout for debounced search
    suggestionsTimeoutRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300); // 300ms delay
  };

  const handleAuth = () => {
    if (isAuthenticated) {
      handleLogout();
    } else {
      navigate('/auth');
    }
  };

  const handleLogout = () => {
    logout();
    handleProfileClose();
    // Reset admin status on logout
    setIsAdmin(false);
    navigate('/');
  };

  const handleProfilePage = () => {
    handleProfileClose();
    navigate(routePath.profile); 
  };

  const handleAdminPage = () => {
    handleProfileClose();
    navigate('/admin'); // Navigate to admin page
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      setShowSuggestions(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSuggestionClick = (movieTitle, movieId) => {
    setSearchQuery('');
    setShowSuggestions(false);
    // Navigate to movie details page or search results
    navigate(`/movie/${movieId}`);
  };

  const handleWatchlistClick = () => {
    if (isAuthenticated) {
      navigate('/watchlist');
    } else {
      // Redirect to auth if not logged in
      navigate('/auth');
    }
  };

  // Function to get user initials for avatar
  const getUserInitials = (username) => {
    if (!username) return 'U';
    return username.charAt(0).toUpperCase();
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Reset admin status when user logs out or authentication changes
  useEffect(() => {
    if (!isAuthenticated) {
      setIsAdmin(false);
    }
  }, [isAuthenticated]);

  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => {
      if (suggestionsTimeoutRef.current) {
        clearTimeout(suggestionsTimeoutRef.current);
      }
    };
  }, []);

  return (
    <AppBar position="static">
      <StyledToolBar>
        <Logo src={logoURL} alt="logo" onClick={() => navigate(routePath.home)} />

        <Box onClick={handleClick}>
          <MenuIcon />
          <Typography>Menu</Typography>
        </Box>

        <HeaderMenu open={open} handleClose={handleClose} />

        <SearchContainer ref={searchRef}>
          <InputSearchField
            placeholder=" Search movies..."
            value={searchQuery}
            onChange={handleSearchInputChange}
            onKeyDown={handleSearch}
            onFocus={() => {
              if (suggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
          />
          <SearchIconContainer>
            <SearchIcon fontSize="small" />
          </SearchIconContainer>
          
          {showSuggestions && suggestions.length > 0 && (
            <SuggestionsPaper>
              <List disablePadding>
                {suggestions.slice(0, 5).map((movie) => (
                  <SuggestionItem
                    key={movie.movieid}
                    onClick={() => handleSuggestionClick(movie.title, movie.movieid)}
                    disablePadding
                  >
                    <ListItemButton sx={{ padding: '8px 12px' }}>
                      <SuggestionText>{movie.title}</SuggestionText>
                    </ListItemButton>
                  </SuggestionItem>
                ))}
              </List>
            </SuggestionsPaper>
          )}
        </SearchContainer>

        <Box onClick={handleWatchlistClick}>
          <BookmarkAddIcon />
          <Typography>Watchlist</Typography>
        </Box>

        {/* Profile Section - shows different content based on auth status */}
        {isAuthenticated ? (
          <>
            <ProfileSection onClick={handleProfileClick}>
              <ProfileAvatar>
                {getUserInitials(user?.username)}
              </ProfileAvatar>
              <Username>{user?.username}</Username>
              <ExpandMoreIcon sx={{ fontSize: 18, color: 'white' }} />
            </ProfileSection>

            <StyledMenu
              anchorEl={profileMenuOpen}
              open={Boolean(profileMenuOpen)}
              onClose={handleProfileClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={handleProfilePage}>
                <ListItemIcon>
                  <AccountCircleIcon sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText>Your Profile</ListItemText>
              </MenuItem>
              
              {/* Conditionally show admin option */}
              {isAdmin && (
                <>
                  <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
                  <MenuItem onClick={handleAdminPage}>
                    <ListItemIcon>
                      <AdminPanelSettingsIcon sx={{ color: 'white' }} />
                    </ListItemIcon>
                    <ListItemText>Manage Website</ListItemText>
                  </MenuItem>
                </>
              )}
              
              <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
              
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText>Sign Out</ListItemText>
              </MenuItem>
            </StyledMenu>
          </>
        ) : (
          <Typography onClick={handleAuth} sx={{ cursor: 'pointer' }}>
            Sign In
          </Typography>
        )}
      </StyledToolBar>
    </AppBar>
  );
};

export default Header;