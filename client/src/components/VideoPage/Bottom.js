import { Typography, Card, CardContent, CardMedia } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = process.env.NODE_ENV === 'production' ? axios.create({baseURL: 'https://calm-fortress-17635.herokuapp.com'}) : 
        axios.create({baseURL: 'http://localhost:5000'});

const base_URL = process.env.NODE_ENV === 'production' ? 'https://calm-fortress-17635.herokuapp.com' : 'http://localhost:5000';

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      height: '220px',
      background: '#eeeeee'
    },
    details: {
      display: 'flex',
      
      flexDirection: 'column',
    },
    content: {
      flex: '1 0 auto',
      width: '220px',
    },
    cover: {
      width: '65%',
      justifyContent: 'flex-start',
    },
    controls: {
      display: 'flex',
      alignItems: 'center',
      paddingLeft: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
  }));

function Bottom() {

    const classes = useStyles();
    const [Bottom, setBottom] = useState([])
    const user = JSON.parse(localStorage.getItem('profile'));

    useEffect(() => {
        API.get('/video/getVideos')
        .then(response => {
            console.log(response.data)
            if(response.data.success) {
                setBottom(response.data.videos)
            } else {
                alert('Problem fetching video from server')
            }
        })
    }, [])

    const renderCards = Bottom.map((video, index) => {
        var minutes = Math.floor(video.duration / 60);
        var seconds = Math.floor(video.duration - minutes * 60);
        if(seconds < 6) {
            seconds = seconds*10;
        }
        return ( 
            <div style={{marginBottom: '15px'}} >
                {user.result.email === video.writer.email || video.privacy !== 0 ? 
                    <Card className={classes.root}>
                        <div>
                            <CardContent className={classes.content}>
                                <Typography gutterBottom variant="h5" component="h4">{video.title}</Typography>
                                    <Typography variant="subtitle1" color="textSecondary">
                                        {video.writer.name}
                                    </Typography>
                            </CardContent>
                            <div className={classes.controls}>
                                <Typography variant="body1" color="textSecondary" >{video.views} views</Typography>
                            </div>
                        </div>
                        <CardMedia 
                            className={classes.cover}
                            image={`${base_URL}/${video.thumbnail}`}
                            //component={Link} to={`/${video._id}`}
                        > 
                            <div style={{ position: 'relative' }}>
                                <a href={`/${video._id}`} >
                                <img style={{ width: '100%' }} alt="thumbnail" src={`${base_URL}/${video.thumbnail}`} />
                                <div className=" duration"
                                    style={{ bottom: 0, right:0, position: 'absolute', margin: '4px', 
                                    color: '#fff', backgroundColor: 'rgba(17, 17, 17, 0.8)', opacity: 0.8, 
                                    padding: '2px 4px', borderRadius:'2px', letterSpacing:'0.5px', fontSize:'12px',
                                    fontWeight:'500', lineHeight:'12px' }}>
                                    <span>{minutes}:{seconds}</span>
                                </div>
                                </a>
                            </div>
                        </CardMedia>
                    </Card>
                : null} 
            </div>       
        )          
    });

    return (
        <React.Fragment>
            {renderCards}
        </React.Fragment>
    )
}

export default Bottom
