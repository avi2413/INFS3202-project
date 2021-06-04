import { Container, Typography, Card, CardActionArea, CardMedia, Avatar, CardHeader, Fab, Collapse, IconButton, TextField, Button } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { deepPurple } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import SearchIcon from '@material-ui/icons/Search';
import CancelIcon from '@material-ui/icons/Cancel';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles({
    container: {
        //maxWidth: 1080,
    },
    root: {
      //maxWidth: 720,
      marginTop: 20,
      elevation: '{3}'
    },
    media: {
      height: 320,
    },
    large: {
        width: 60,
        height: 60,
        background: deepPurple[200]
    },
});

const API = process.env.NODE_ENV === 'production' ? axios.create({baseURL: 'https://calm-fortress-17635.herokuapp.com'}) : 
        axios.create({baseURL: 'http://localhost:5000'});

const base_URL = process.env.NODE_ENV === 'production' ? 'https://calm-fortress-17635.herokuapp.com' : 'http://localhost:5000';

function Home() {

    const user = JSON.parse(localStorage.getItem('profile'));
    const classes = useStyles();
    const history = useHistory();
    const [Videos, setVideos] = useState([]);
    const [draweOpen, setdraweOpen] = useState(false);
    const [serachKey, setserachKey] = useState("");
    const [searchResult, setsearchResult] = useState([])

    useEffect(() => {
        API.get('/video/getVideos')
        .then(response => {
            if(response.data.success) {
                setVideos(response.data.videos)
            } else {
                alert('Problem fetching video from server')
            }
        })
    }, [])

    const toggleSearchDrawer = () => {
        setdraweOpen(!draweOpen);
    }

    const handleSubmit = (e) => {
        const variable = {
            title: serachKey
        }
        e.preventDefault()
        API.post('/video/searchVideo', variable)
        .then(response => {
            if(response.data.success) {
                setsearchResult(response.data.video[0])
                setserachKey("")
                console.log(searchResult._id)
                if (searchResult._id !== undefined) {
                    history.push(`/${searchResult._id}`)
                }
                
            } else {
                alert('Problem searching')
            }
        })
    }

    const handleChange = (e) => {
        setserachKey(e.currentTarget.value);
    }
    

    const renderCards = Videos.map((video, index) => {
        // const renderImg = () => {
        //     return (
                
        //     )
        // }
        var minutes = Math.floor(video.duration / 60);
        var seconds = Math.floor(video.duration - minutes * 60);
        if(seconds < 6) {
            seconds = seconds*10;
        }
        return ( 
            <div>
                {user.result.email === video.writer.email || video.privacy !== 0 ? 
                    <Card className={classes.root}>
                        <CardActionArea>
                            <CardMedia 
                                // className={classes.media}
                                // image={`http://localhost:5000/${video.thumbnail}`}
                                //component={Link} to={`/${video._id}`}
                            > 
                                <div style={{ position: 'relative' }}>
                                    <a href={`/${video._id}`} >
                                    <img style={{ width: '100%', height: '300px' }} alt="thumbnail" src={`${base_URL}/${video.thumbnail}`} />
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
                            <CardHeader 
                                avatar={
                                    <Avatar src={video.writer.name} className={classes.large}>
                                            {video.writer.name.charAt(0)+video.writer.name.split(" ")[1].charAt(0)}
                                    </Avatar>
                                }
                                title = {    
                                    <Typography gutterBottom variant="h5" component="h4">{video.title}</Typography>        
                                }
                                subheader={
                                    <div>
                                        <div style={{ position: 'absolute', flexBasis:'50%' }}>
                                            <Typography variant="body2" color="textSecondary" component="p" >{video.writer.name}</Typography>
                                        </div>
                                        <div style={{ flexBasis:'50%', position:'relative'}}>
                                            <Typography variant="body1" color="textSecondary" style={{ float:'right', paddingRight: '5px'}} >{video.views} views</Typography>
                                        </div>   
                                    </div>   
                                }
                            />
                            {/* <CardContent>
                                <Typography variant="body1" color="textSecondary" style={{ float:'right'}} >{video.views} views</Typography>
                            </CardContent> */}
                        </CardActionArea>
                    </Card>
                : null} 
            </div>       
        )           
    });

    return (
        <Container maxWidth='lg' className={classes.container}>
            <Collapse in={draweOpen}>
                <form style={{ display:'flex' }} onSubmit={handleSubmit}>
                    <IconButton onClick={toggleSearchDrawer}>
                        <CancelIcon />
                    </IconButton>
                    <br />
                    <TextField  
                        label = "Search"  
                        variant = "filled" 
                        fullWidth
                        onChange={handleChange}
                        value = {serachKey}
                    / >
                    <br />
                    <Button disableElevation variant="contained" color="primary" onClick={handleSubmit}>
                        <SearchIcon />
                    </Button>
                </form>
            </Collapse>
            <Typography variant='h3' component='h1' >
                Watch Now
            </Typography>
            <hr />
            <div>
                { renderCards }
            </div>  
            <div style={{position:'sticky', bottom: '50px', marginLeft: '450px'}}>
                <Fab color="primary" onClick={toggleSearchDrawer}>
                    <SearchIcon />
                </Fab>
            </div>      
        </Container>
    )
};

export default Home
