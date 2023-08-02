import { useState } from 'react';
import { AppBar, Toolbar, Button, IconButton, Typography, MenuItem, Menu, Avatar, Box } from '@mui/material';
import { Menu as MenuIcon, AccountCircle } from '@mui/icons-material';
import './navbar.css';
import { Link } from "react-router-dom";

function Navber(props) {
    const [openMenu, setOpenMenu] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleOpenMenu = (event) => {
        setOpenMenu(true);
        setAnchorEl(event.currentTarget);
    }

    const handleCloseMenu = () => {
        setOpenMenu(false);
        setAnchorEl(null);
    }

    return (
        <>
            <AppBar position="fixed">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={props.handleButtonClick}
                        className="logo-size"
                        sx={{ margin: "0 1px" }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <IconButton className="logo-size" sx={{ px: 1, margin: "0 6px" }}>
                        <Link to="/">
                            <Avatar alt="Kyklos" className="logo-size" src={require('../assets/logo.png')} />
                        </Link>
                    </IconButton>
                    <Typography component="div" sx={{ flexGrow: 1 }} className='header-title'>
                        VirtFuse Dashboard
                    </Typography>
                    {props.auth === true ? (<div>
                        <IconButton
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenMenu}
                            color="inherit"
                            sx={{ p: 0, display: "flex" }}
                        >
                            <AccountCircle className="admin-logo" />
                            <span className="admin-text" style={{}}>Admin</span>
                        </IconButton>
                        <Box sx={{ position: 'relative', flexGrow: 0 }} >
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                open={openMenu}
                                onClose={handleCloseMenu}
                                sx={{
                                    '& .MuiPaper-root': {
                                        backgroundColor: '#494b59', // gray
                                        color: 'white'
                                    },
                                    mt: "30px"
                                }}
                            >
                                <MenuItem >
                                    <Link to="/logout" style={{ textDecoration: 'none', color: 'white' }}>Sign out</Link>
                                </MenuItem>
                            </Menu>
                        </Box>
                    </div>) : (<Button color="inherit">
                        <Link to="/login" style={{ textDecoration: 'none', color: 'white' }}>Login</Link></Button>)}
                </Toolbar>
            </AppBar>
        </>
    );
}

export default Navber;