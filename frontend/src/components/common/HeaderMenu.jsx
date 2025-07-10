import { Menu, MenuItem, Divider, ListItemIcon, ListItemText } from "@mui/material";
import { 
    TrendingUp, 
    Star, 
    Schedule, 
    Search,
    FilterList 
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { routePath } from "../../constants/route";
import { styled } from "@mui/material/styles";

// Styled components for enhanced appearance
const StyledMenu = styled(Menu)(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 12,
        minWidth: 220,
        marginTop: theme.spacing(1),
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        border: `1px solid ${theme.palette.divider}`,
        '& .MuiMenuItem-root': {
            padding: '12px 16px',
            fontSize: '0.95rem',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
                backgroundColor: theme.palette.action.hover,
                transform: 'translateX(4px)',
            },
        },
    },
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
    borderRadius: 8,
    margin: '2px 8px',
    '&:hover': {
        backgroundColor: theme.palette.primary.main + '15',
        '& .MuiListItemIcon-root': {
            color: theme.palette.primary.main,
        },
        '& .MuiListItemText-primary': {
            color: theme.palette.primary.main,
            fontWeight: 500,
        },
    },
}));

const StyledLink = styled(Link)({
    textDecoration: 'none',
    color: 'inherit',
    display: 'block',
});

const HeaderMenu = ({ open, handleClose }) => {
    const openMenu = Boolean(open);

    const menuItems = [
        {
            label: 'Popular',
            icon: <TrendingUp />,
            path: `${routePath.categories}?category=popular`,
        },
        {
            label: 'Top Rated',
            icon: <Star />,
            path: `${routePath.categories}?category=toprated`,
        },
        {
            label: 'Upcoming',
            icon: <Schedule />,
            path: `${routePath.categories}?category=upcoming`,
        },
    ];

    return (
        <StyledMenu
            id="header-menu"
            anchorEl={open}
            open={openMenu}
            onClose={handleClose}
            MenuListProps={{
                'aria-labelledby': 'header-menu-button',
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
            {menuItems.map((item, index) => (
                <StyledLink 
                    key={index}
                    to={item.path} 
                    onClick={handleClose}
                >
                    <StyledMenuItem>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText 
                            primary={item.label}
                            primaryTypographyProps={{
                                fontSize: '0.95rem',
                                fontWeight: 400,
                            }}
                        />
                    </StyledMenuItem>
                </StyledLink>
            ))}
            
            <Divider sx={{ margin: '8px 0' }} />
            
            <StyledLink 
                to={routePath.advancedSearch || '/advanced-search'} 
                onClick={handleClose}
            >
                <StyledMenuItem>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                        <Search />
                    </ListItemIcon>
                    <ListItemText 
                        primary="Advanced Search"
                        primaryTypographyProps={{
                            fontSize: '0.95rem',
                            fontWeight: 400,
                        }}
                    />
                    {/* <FilterList sx={{ ml: 1, fontSize: '1.1rem', opacity: 0.6 }} /> */}
                </StyledMenuItem>
            </StyledLink>
        </StyledMenu>
    );
};

export default HeaderMenu;