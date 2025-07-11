// Header.jsx
import { useState, useEffect } from 'react';
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
  Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
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

const InputSearchField = styled(InputBase)`
  background: #FFFFFF;
  height: 30px;
  width: 50%;
  border-radius: 5px;
  padding-left: 10px;
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCheckLoading, setAdminCheckLoading] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

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
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
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

  // Reset admin status when user logs out or authentication changes
  useEffect(() => {
    if (!isAuthenticated) {
      setIsAdmin(false);
    }
  }, [isAuthenticated]);

  return (
    <AppBar position="static">
      <StyledToolBar>
        <Logo src={logoURL} alt="logo" onClick={() => navigate(routePath.home)} />

        <Box onClick={handleClick}>
          <MenuIcon />
          <Typography>Menu</Typography>
        </Box>

        <HeaderMenu open={open} handleClose={handleClose} />

        <InputSearchField
          placeholder="Search movies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearch}
        />

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