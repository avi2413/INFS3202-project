import { Avatar, Button, IconButton, Toolbar, Typography, AppBar, MenuItem, Menu, Container } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import React, { useState, useEffect } from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom';
import decode from 'jwt-decode';
import { useDispatch } from 'react-redux';
import useStyles from './style.js'

const Navbar = () => {
    const classes = useStyles();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const dispatch = useDispatch();
    const history = useHistory()
    const location = useLocation();

    const handleLogout = () => {
        dispatch({ type: 'LOGOUT' });
        history.push("/");
        setUser(null); //clears localstorage
    };

    useEffect(() => {
        const token = user?.token;
        if(token) {
            const decodeToken = decode(token);
            if (decodeToken.exp * 1000 < new Date().getTime()) handleLogout();
        }
        setUser(JSON.parse(localStorage.getItem('profile')));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };



    return (
        <AppBar className={classes.appBar} position="sticky" color="inherit" >
            {/* <div>
                <Typography className={classes.heading} component={Link} to="/homepage" variant="h3" align="center">VidMate</Typography>
            </div> */}
            <Typography className={classes.heading} component={Link} to="/homepage" variant="h3" align="center">VideoPedia</Typography>
            <Toolbar className={classes.toolbar}>
                {user ? (
                    <div>
                        <Container className={classes.profile} style={{paddingTop:'5px'}}>
                            <Avatar className={classes.purple} alt={user.result.name} src={user.result.imageUrl} component={Link} to="/profile">
                                {user.result.name.charAt(0)+user.result.name.split(" ")[1].charAt(0)}
                            </Avatar>
                            {/* <Typography className={classes.userName} variant="h6">
                                {user.result.name}
                            </Typography> */}
                            <IconButton aria-label="Actions" onClick={handleClick}>
                                <MoreVertIcon style={{color: grey[50]}} fontSize="large" />
                            </IconButton>
                            <Menu
                                id="simple-menu"
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                                <MenuItem component={Link} to="/upload">Upload</MenuItem>
                            </Menu>
                        </Container>   
                    </div>
                    
                ) : (
                <Button style={{color:'white', fontWeight:'Bold'}} component={Link} to="/">
                    Sign In
                </Button>
            )}
            </Toolbar>    
        </AppBar>
    )
}

export default Navbar
