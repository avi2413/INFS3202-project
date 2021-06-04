import React, { useState } from 'react'
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import { Avatar, Typography, IconButton, Button, TextField } from '@material-ui/core';
import Collapse from '@material-ui/core/Collapse';
import SendIcon from '@material-ui/icons/Send';
import axios from 'axios';
import ReplyComment from './ReplyComment.js';
import LikeDislike from './LikeDislike.js';

const API = process.env.NODE_ENV === 'production' ? axios.create({baseURL: 'https://calm-fortress-17635.herokuapp.com'}) : 
        axios.create({baseURL: 'http://localhost:5000'});

export default function SingleComment(props) {
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    var today = new Date(), 
    date = today.getDate() + ' ' + monthNames[today.getMonth()] + ' ' + today.getFullYear();

    const [expanded, setExpanded] = React.useState(false);
    const [CommentValue, setCommentValue] = useState("");
    const user = JSON.parse(localStorage.getItem('profile'));

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleChange = (e) => {
        setCommentValue(e.currentTarget.value)
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const variables = {
            writer: props.user.result._id,
            postId: props.postId,
            responseTo: props.comment._id,
            content: CommentValue
        }
        API.post('/comment/saveComment', variables)
        .then(response => {
            if(response.data.success) {
                setCommentValue("")
                props.refreshFunction(response.data.result)
            } else {
                alert('Failed to comment!')
            }
        })
    }

    return (
        <div>
            <Card sx={{ maxWidth: 345 }} elevation={3}>
                <CardHeader 
                    avatar={
                        <Avatar>
                            {props.comment.writer.name.charAt(0)+props.comment.writer.name.split(" ")[1].charAt(0)}
                        </Avatar>
                    }
                    title = {props.comment.writer.name}
                    subheader = {date}
                 />
                <CardContent>
                    <Typography variant="body2">
                        {props.comment.content}
                    </Typography>
                </CardContent>
                <CardActions>
                    <div style={{flexBasis:'90%'}}>
                        <LikeDislike commentId={props.comment._id} userId={user.result._id} />
                    </div>
                    <div style={{position:'relative', flexBasis:'10%'}}>
                        {/* <ExpandMore 
                            
                            expand={expanded}
                            onClick={handleExpandClick}
                            aria-expanded={expanded}
                            aria-label="show more"
                        >
                            <ExpandMoreIcon />
                        </ExpandMore> */}
                        <Button onClick={handleExpandClick} variant='standard'>
                            <Typography variant='body2' color='textSecondary'>
                               {!expanded ? "Reply" : "Close"}
                            </Typography>    
                        </Button>
                    </div>   
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <ReplyComment user={props.user} comment={props.comment} commentList={props.commentList} postID={props.postId} parentCommentId={props.comment._id} refreshFunction={props.refreshFunction} />
                        <form style={{ display:'flex' }} onSubmit={handleSubmit}>
                            {/* {props.commentList && props.commentList.map((comment, index) => ( 
                                <ReplyComment user={props.user} commentList={props.commentList} postID={props.postId} parentCommentId={comment._id} refreshFunction={props.refreshFunction} />
                            ))} */}
                            
                            <TextField onChange={handleChange} value={CommentValue} variant="filled" fullWidth size="small" label="Add a reply..."/>
                            <br />
                            <Button style={{marginLeft:'5px'}} variant="contained" disableElevation color="inherit" onClick={handleSubmit}> <SendIcon /> </Button>
                        </form>
                    </CardContent>
                </Collapse>
            </Card>
        </div>
    )
}
