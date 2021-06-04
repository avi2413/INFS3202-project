import { Button, TextField, Typography } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import React, { useState } from 'react';
import axios from 'axios';
import SingleComment from './SingleComment.js';

const API = process.env.NODE_ENV === 'production' ? axios.create({baseURL: 'https://calm-fortress-17635.herokuapp.com'}) : 
        axios.create({baseURL: 'http://localhost:5000'});

function Comment(props) {

    const [Comment, setComment] = useState("");
    const user = JSON.parse(localStorage.getItem('profile'));
    const handleSubmit = (e) => {
        e.preventDefault();
        const variables = {
            content: Comment,
            writer: user.result._id,
            postId: props.postId
        }
        API.post('/comment/saveComment', variables)
        .then(response=> {
            if(response.data.success) {
                setComment("")
                props.refreshFunction(response.data.result)
            } else {
                alert("Failed to comment!");
            }
        })
    }

    const handleChange = (event) => {
        setComment(event.currentTarget.value);
    }

    const cmntList = props.commentList.slice(0).reverse();

    return (
        <div>
            <div>
                <Typography color="textSecondry" style={{ fontSize:'16', color:'grey', marginTop:'10px'}}> {props.commentList.length} Comments </Typography>
            </div>
            
            {/* {console.log(props.commentList)} */}
            <hr />
            <form style={{ display:'flex' }} onSubmit={handleSubmit}>
                <TextField onChange={handleChange} value={Comment} variant="outlined" required fullWidth size="small" placeholder="Add a public comment..."/>
                <br />
                <Button style={{marginLeft:'5px'}} variant="contained" disableElevation color="primary" onClick={handleSubmit}> <SendIcon /> </Button>
            </form>
            {props.commentList && cmntList.map((comment, index) => (
                (!comment.responseTo && 
                    <React.Fragment>
                        <SingleComment user={user} comment={comment} postId={props.postId} refreshFunction={props.refreshFunction} commentList={props.commentList}/>
                    </React.Fragment>
                ) 
            ))}
        </div> 
    )
}

export default Comment
