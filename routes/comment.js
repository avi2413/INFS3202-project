import express from 'express';
import Comment from '../models/comment.js';

const router = express.Router();

router.post('/saveComment', (req, res) => {
    const comment = new Comment(req.body)
    console.log(comment)
    comment.save((err, comment) => {
        if(err) return res.json({ success:false, err })

        Comment.find({ '_id': comment._id })
        .populate('writer')
        .exec((err, result) => {
            if(err) return res.json({ success:false, err })
            
            return res.status(200).json({ success:true, result })
        })
    })
    
})

router.post('/getComments', (req, res) => {
    Comment.find({ "postId":req.body.videoId })
    .populate('writer')
    .exec((err, comments) => {
        if(err) return res.json({ success:false, err })
        res.status(200).json({ success:true, comments })
    })
})

export default router;