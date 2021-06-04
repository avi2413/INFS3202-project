import express from 'express';
import Like from '../models/like.js';
import Dislike from '../models/dislike.js';

const router = express.Router();

router.post('/getLikes', (req, res) => {
    let variable = {}
    if(req.body.videoId) {
        variable = { videoId: req.body.videoId, userId: req.body.userId }
    } else {
        variable = { commentId: req.body.commentId, userId: req.body.userId }
    }
    Like.find(variable)
    .exec((err, likes) => {
        if(err) return res.status(400).send(err)
        res.status(200).json({ success: true, likes })
    })
})

router.post('/getDisLikes', (req, res) => {
    let variable = {}
    if(req.body.videoId) {
        variable = { videoId: req.body.videoId, userId: req.body.userId }
    } else {
        variable = { commentId: req.body.commentId, userId: req.body.userId }
    }
    Dislike.find(variable)
    .exec((err, dislikes) => {
        if(err) return res.status(400).send(err)
        res.status(200).json({ success: true, dislikes })
    })
})

router.post('/upLike', (req, res) => {
    let variable = {}
    if(req.body.videoId) {
        variable = { videoId: req.body.videoId, userId: req.body.userId }
    } else {
        variable = { commentId: req.body.commentId, userId: req.body.userId }
    }
    const like = new Like(variable)
    like.save((err, likeResult) => {
        if(err) return res.json({ success: false, err })
        Dislike.findOneAndDelete(variable)
        .exec((err, disLikesResult) => {
            if(err) return res.status(400).json({ success: false, err });
            res.status(200).json({ success: true })
        })

    })
})

router.post('/unLike', (req, res) => {
    let variable = {}
    if(req.body.videoId) {
        variable = { videoId: req.body.videoId, userId: req.body.userId }
    } else {
        variable = { commentId: req.body.commentId, userId: req.body.userId }
    }
    Like.findOneAndDelete(variable)
    .exec((err, result) => {
        if(err) return res.status(400).json({ success: false, err })
        res.status(200).json({ success: true })
    })
})

router.post('/unDisLike', (req, res) => {
    let variable = {}
    if(req.body.videoId) {
        variable = { videoId: req.body.videoId, userId: req.body.userId }
    } else {
        variable = { commentId: req.body.commentId, userId: req.body.userId }
    }
    Dislike.findOneAndDelete(variable)
    .exec((err, result) => {
        if(err) return res.status(400).json({ success: false, err })
        res.status(200).json({ success: true })
    })
})

router.post('/upDisLike', (req, res) => {
    let variable = {}
    if(req.body.videoId) {
        variable = { videoId: req.body.videoId, userId: req.body.userId }
    } else {
        variable = { commentId: req.body.commentId, userId: req.body.userId }
    }
    const dislike = new Dislike(variable)
    dislike.save((err, dislikeResult) => {
        if(err) return res.json({ success: false, err })
        Like.findOneAndDelete(variable)
        .exec((err, likesResult) => {
            if(err) return res.status(400).json({ success: false, err });
            res.status(200).json({ success: true })
        })

    })
})

router.post('/getLiked', (req, res) => {
    Like.find({"userId": req.body.userId})
    .exec((err, likes) => {
        if(err) return res.status(400).json({ success: false, err });
        res.status(200).json({ success: true, likes })
    })
})

export default router;