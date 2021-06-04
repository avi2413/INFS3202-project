import { Card, CardContent, CardHeader, Typography, Avatar, Collapse, Button, Container } from '@material-ui/core';
import React, { useEffect, useState } from 'react';


function ReplyComment(props) {

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    var today = new Date(), 
    date = today.getDate() + ' ' + monthNames[today.getMonth()] + ' ' + today.getFullYear();

    const [ChildCount, setChildCount] = useState(0);
    const [expanded, setexpanded] = useState(false)

    useEffect(() => {

        let childCtr = 0;

        props.commentList.map((comment) => {
            if(comment.responseTo === props.parentCommentId) {
                childCtr++;
            }
            setChildCount(childCtr);
        })

    }, [props.commentList, props.parentCommentId])

    const handleExpand = () => {
        setexpanded(!expanded)
    }

    return (
        <Container>
            {(ChildCount > 0) && 
                <Button style={{ marginLeft: '50px', color:'#3266a8' }} onClick={handleExpand} disableRipple>
                    {!expanded? (ChildCount > 1) ? `View ${ChildCount} replies` : `View reply` : "Collapse"} 
                </Button>
            }
            <Collapse in={expanded}>
            {
                props.commentList && props.commentList.map((comment, index) => (
                    <Container style={{ marginLeft: '50px', width: '80%' }}>
                        <React.Fragment>
                            {comment.responseTo === props.parentCommentId && 
                                <div>
                                    <Card elevation={0} disableGutter>
                                        <CardHeader 
                                            avatar={
                                                <Avatar>
                                                    {comment.writer.name.charAt(0)+comment.writer.name.split(" ")[1].charAt(0)}
                                                </Avatar>
                                            }
                                            title = {comment.writer.name}
                                            subheader = {date}
                                        />
                                        <CardContent>
                                            <Typography variant="subtitle2" >
                                                {comment.content}
                                            </Typography>
                                        </CardContent>

                                    </Card>
                                </div>
                            } 
                        </React.Fragment>
                    </Container>
                    
                ))
            }
            </Collapse>
            
        </Container>
    )
}

export default ReplyComment
