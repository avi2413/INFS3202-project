import { IconButton, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';
import ThumbUpOutlinedIcon from '@material-ui/icons/ThumbUpOutlined';
import ThumbDownOutlinedIcon from '@material-ui/icons/ThumbDownAltOutlined';
import axios from 'axios';

const API = process.env.NODE_ENV === 'production' ? axios.create({baseURL: 'https://calm-fortress-17635.herokuapp.com'}) : 
        axios.create({baseURL: 'http://localhost:5000'});

function LikeDislike(props) {

    let variable = {};

    if (props.video) {
        variable =  {videoId: props.videoId, userId: props.userId}
    } else {
        variable =  {commentId: props.commentId, userId: props.userId}
    }

    
    const [Likes, setLikes] = useState(0);
    const [DisLikes, setDisLikes] = useState(0);
    const [LikeAction, setLikeAction] = useState(null);
    const [DislikeAction, setDislikeAction] = useState(null);

    const onLike = (event) => {
        event.stopPropagation();
        if (LikeAction === null) {
            API.post('/like/upLike', variable)
            .then(respose => {
                if(respose.data.success) {
                    setLikes(Likes + 1)
                    setLikeAction('liked')
                    if (DislikeAction !== null) {
                        setDislikeAction(null)
                        setDisLikes(DisLikes - 1)
                    }
                } else {
                    alert('Failed to like')
                }
            })
        } else {
            API.post('/like/unLike', variable)
            .then(respose => {
                if(respose.data.success) {
                    setLikes(Likes - 1)
                    setLikeAction(null)
                } else {
                    alert('Failed to unlike')
                }
            })
        }
    }

    const onDislike = (e) => {
        e.stopPropagation();
        if (DislikeAction !== null) {
            API.post('/like/unDisLike', variable)
            .then(respose => {
                if(respose.data.success) {
                    setDisLikes(DisLikes - 1)
                    setDislikeAction(null)
                } else {
                    alert('Failed to undislike')
                }
            })
        } else {
            API.post('/like/upDisLike', variable)
            .then(respose => {
                if(respose.data.success) {
                    setDisLikes(DisLikes + 1)
                    setDislikeAction("disliked")
                    if(LikeAction !== null) {
                        setLikeAction(null)
                        setLikes(Likes - 1)
                    }
                } else {
                    alert('Failed to dislike')
                }
            }) 
        }
    }

    useEffect(() => {
        API.post('/like/getLikes', variable)
        .then(respose => {
            if(respose.data.success) {
                setLikes(respose.data.likes.length);
                respose.data.likes.map(likes => {
                    if(likes.userId === props.userId) {
                        setLikeAction('liked')
                    }
                })
            } else {
                alert('Like failed!')
            }
        })

        API.post('/like/getDisLikes', variable)
        .then(respose => {
            if(respose.data.success) {
                setDisLikes(respose.data.dislikes.length);
                respose.data.dislikes.map(dislikes => {
                    if(dislikes.userId === props.userId) {
                        setDislikeAction('disliked')
                    }
                })
            } else {
                alert('Dislike failed!')
            }
        })
    }, [])

    return (
        <React.Fragment>
            <span>
                <IconButton disableRipple disableFocusRipple onClick={onLike}>
                    {LikeAction === 'liked' ? <ThumbUpAltIcon style={{ fontSize: 20 }}/> : <ThumbUpOutlinedIcon style={{ fontSize: 20 }}/>}
                    <Typography style={{marginLeft:'5px', fontSize:'16'}}>
                        {Likes}
                    </Typography>
                </IconButton>
            </span>
            <span>
                <IconButton disableRipple disableFocusRipple edge='end' onClick={onDislike}>
                    {DislikeAction === 'disliked' ? <ThumbDownAltIcon style={{ fontSize: 20 }}/> : <ThumbDownOutlinedIcon style={{ fontSize: 20 }}/>}
                    <Typography style={{marginLeft:'5px', fontSize:'16'}}>
                        {DisLikes}
                    </Typography>
                </IconButton>
            </span>

        </React.Fragment>
    )
}

export default LikeDislike
