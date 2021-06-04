import { Container, Grid, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = process.env.NODE_ENV === 'production' ? axios.create({baseURL: 'https://calm-fortress-17635.herokuapp.com'}) : 
        axios.create({baseURL: 'http://localhost:5000'});

function Profile() {
    const user = JSON.parse(localStorage.getItem('profile'));
    const [Videos, setVideos] = useState([])
    useEffect(() => {
        API.post('/like/getLiked', {"userId": user.result._id})
        .then(response => {
            if(response.data.success) {
                console.log(response.data)
                setVideos(response.data.likes.videoId)
                
            } else {
                alert("Failed to get liked videos")
            }  
        })
    })

    return (
        <Container>
            <Grid>
                <Typography variant="h2">
                    Hi, {user.result.name}
                </Typography>
            </Grid>
        </Container>
    )
}

export default Profile
