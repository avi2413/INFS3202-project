import React, { useState } from 'react';
import { Avatar, Button, Paper, Grid, Typography, Container } from '@material-ui/core';
import { GoogleLogin } from 'react-google-login';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import LockOutlinedIcon from '@material-ui/icons/LockOpenOutlined';
import useStyles from './styles';
import Input from './Input';
import Icon from './Icon.js';
import { signin, signup } from '../../actions/auth.js';

const initState = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
};

const Auth = () => {

    const classes = useStyles();

    const [isSignup, setIsSignup] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState(initState);

    const dispatch = useDispatch();
    const history = useHistory();

    const handleShowPassword = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        if(isSignup) {
            dispatch(signup(formData, history));
        } else {
            dispatch(signin(formData, history));
        }
    };

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const switchMode = () => {
        setIsSignup((prevIsSignup) => !prevIsSignup);
        setShowPassword(false);
    };

    const googleSuccess = async (res) => {
        const result = res?.profileObj;
        const token = res?.tokenId;
        try {
            //console.log("Auth data from Auth.js", result, token);
            dispatch({ type: "AUTH", data: { result, token } });
            history.push('/homepage');
        } catch (error) {
            console.log(error);
        }
    };
    const googleFailue = () => {
        console.log("Google sign in was unsuccessful. Try Again Later.")
    };

    return (
        <Container component = "main" maxWidth = "xs" /*style={classes.container}*/>
            <Paper className = {classes.paper} elevation = {3}>
                <Avatar className = {classes.avatar} >
                    <LockOutlinedIcon />
                </Avatar>
                <Typography varient="h5">
                    {isSignup ? 'Sign Up' : "Sign In"}
                </Typography>
                <form className={classes.form} onSubmit={handleSubmit}> 
                    <Grid container spacing = {2}>
                        {isSignup && (
                            <>
                                <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half/>
                                <Input name="lastName" label="Last Name" handleChange={handleChange} half/>
                            </>
                        )}
                        <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
                        <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? "text" : "password"} handleShowPassword ={handleShowPassword} />
                        { isSignup && <Input name="confirmPassword" label="Confirm Password" handleChange={handleChange} type="password" /> }
                    </Grid>
                    <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                            { isSignup ? "Sign Up" : "Sign In"}
                    </Button>
                    <GoogleLogin
                        clientId = "846774650020-10bvf141qpacfkhjcgef4r9r2req691m.apps.googleusercontent.com"
                        render = {(renderProps) => (
                            <Button 
                                className = {classes.googleButton}
                                color="primary"
                                variant="contained"
                                fullWidth
                                onClick={renderProps.onClick}
                                disabled={renderProps.disabled}
                                startIcon={<Icon />}
                            >
                                Google Sign In
                            </Button>
                        )}
                        onSuccess={googleSuccess}
                        onFailure={googleFailue}
                        cookiePolicy="single_host_origin"
                    />
                    <Grid container justify="flex-end">
                            <Grid item>
                                <Button onClick={switchMode}>
                                    {isSignup ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
                                </Button>
                            </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    )
};

export default Auth
