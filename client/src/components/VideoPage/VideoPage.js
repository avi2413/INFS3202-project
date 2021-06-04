import React, { useEffect, useState } from 'react'
import axios from 'axios';
import ReactPlayer from 'react-player';
import { Typography, Container, Accordion, AppBar, Grid } from '@material-ui/core';
import Bottom from './Bottom.js';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@material-ui/core/styles';
import { ReactVideo } from "reactjs-media";
import { makeStyles } from '@material-ui/core/styles';
import Subscriber from './Subscriber';
import Comment from './Comment';
import LikeDislike from './LikeDislike';

const useStyles = makeStyles((theme) => ({
    heading: {
        fontSize: theme.typography.pxToRem(25),
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
        paddingTop:'5px'
    },
    column: {
        flexBasis: '50%',
    },
}));

const API = process.env.NODE_ENV === 'production' ? axios.create({baseURL: 'https://calm-fortress-17635.herokuapp.com'}) : 
        axios.create({baseURL: 'http://localhost:5000'});

const base_URL = process.env.NODE_ENV === 'production' ? 'https://calm-fortress-17635.herokuapp.com' : 'http://localhost:5000';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
        role="tabpanel"
        hidden={value !== index}
        id={`full-width-tabpanel-${index}`}
        aria-labelledby={`full-width-tab-${index}`}
        {...other}
        >
        {value === index && (
            <Box sx={{ p: 2 }}>
            <Typography>{children}</Typography>
            </Box>
        )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}


function VideoPage(props) {

    const classes = useStyles();
    const theme = useTheme();
    const videoId = props.match.params.videoId
    const [VideoPath, setVideoPath] = useState("");
    const [VideoData, setVideoData] = useState("");
    const [CommentList, setCommentList] = useState([])
    const [views, setViews] = useState(0);
    const [Writer, setWriter] = useState("");
    const [value, setValue] = useState(0);
    const user = JSON.parse(localStorage.getItem('profile'));

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };

    // const videoVariable = {
    //     videoId: videoId
    // }
    console.log(videoId);
    useEffect(() => {
        API.post('/video/getVideo',  {"videoId": videoId})
        .then(response => {
            if(response.data.success) {
                setVideoPath(response.data.video.filePath)
                setVideoData(response.data.video)
                setWriter(response.data.video.writer.name)
                //console.log(response.data.video)
                setViews(response.data.video.views)
            } else {
                alert('Failed to fetch video info. Server Error')
            }
        })
        API.post('/comment/getComments',  {"videoId": videoId})
        .then(response => {
            if(response.data.success) {
                console.log("Comment is : ", response.data.comments)
                setCommentList(response.data.comments)
            } else {
                alert('Failed to fetch video info. Server Error')
            }
        })
    }, [])

    const updateComment = (newComment) => {
        setCommentList(CommentList.concat(newComment))
    }

    const handleOnPlay = () => {
        API.post('/video/view', VideoData)
        .then(response => {
            console.log(response.data)
        })
        setViews(views+1)
    }


    //console.log(`http://localhost:5000/uploads/${VideoPath.split("/").slice(-1).pop()}`)

    return (
        <Container>
            <div style={{marginTop: '20px', display:'block', position: '-webkit-sticky', zIndex:'1000', top:'100px', backgroundColor: '#ffffff'}}>
                <Container style={{marginTop: '20px', display:'block', position:'sticky'}} disableGutters="true">
                    <ReactPlayer 
                        controls 
                        url={`${base_URL}/uploads/${VideoPath.split("/").slice(-1).pop()}`} 
                        onPlay={handleOnPlay} 
                        width="100%"
                    />
                    {/* <ReactVideo 
                        src={`http://localhost:5000/uploads/${VideoPath.split("/").slice(-1).pop()}`}
                        primaryColor="blue"
                        //poster={`http://localhost:5000/${VideoData.thumbnail}`}
                    /> */}
                </Container>
                <Container style={{marginTop: '0px', position: 'relative'}} disableGutters="true">
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                        >
                            <div className={classes.column}>
                                <Typography variant="h4" className={classes.heading} style={{ fontWeight:'Bold'}}>
                                    {VideoData.title}
                                    <Typography className={classes.secondaryHeading}>{views} views</Typography>
                                </Typography>
                            </div>
                            <div className={classes.column} style={{ position: 'relative'}}>
                                <Grid container spacing = {0}
                                    direction="row"
                                    justifyContent="flex-end"
                                    alignItems="center"
                                >
                                    <Grid item xs={8} style={{marginTop:'1px'}}> 
                                        <LikeDislike videoId={videoId} userId={user.result._id} />
                                    </Grid>
                                    <Grid item xs={4} > 
                                        <Subscriber />
                                    </Grid>
                                </Grid>
                                
                                {/* <Typography className={classes.secondaryHeading} style={{ float:'right'}}>{views} views</Typography> */}
                            </div>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div>
                                <Typography variant="h3" className={classes.heading} style={{ fontSize:'24', color:'#616161'}}>
                                    {Writer}
                                </Typography>
                                <Typography variant="body1" className={classes.heading} style={{ fontSize:'16', color:'#424242'}}>
                                    {VideoData.description}
                                </Typography>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                    {/* <span>{VideoData.description}</span>
                    <span style={{ float:'right'}}>{views} views</span>
                    <hr style={{marginTop: '25px', width: '640px'}}/> */}
                </Container>
                <AppBar style={{ marginTop:'20px'}} position="static" color="inherit" elevation={1} >
                    <Tabs value={value} onChange={handleChange} indicatorColor="secondary" textColor="secondary" variant="fullWidth">
                        <Tab label="Recommended" {...a11yProps(0)}/>
                        <Tab label="Comment" {...a11yProps(1)}/>
                    </Tabs>
                </AppBar>
                
            </div>
            
            
            
            
            <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={value}
                onChangeIndex={handleChangeIndex}
            >
                <TabPanel value={value} index={0} dir={theme.direction}>
                    <Container style={{marginTop: '20px'}} disableGutters="true">
                        <Bottom />
                    </Container>
                </TabPanel>
                <TabPanel value={value} index={1} dir={theme.direction}>
                    <Comment commentList={CommentList} postId={videoId} refreshFunction={updateComment} />
                </TabPanel>
            </SwipeableViews>
            
            
            
        </Container>
    )
}

export default VideoPage
