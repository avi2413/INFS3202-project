import express from 'express';
import multer from 'multer';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import Video from '../models/video.js';
import mongoose from 'mongoose';

const router = express.Router();


const filePath = path.resolve('uploads') + '/'

mongoose.set('useCreateIndex', true);

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, filePath)
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`)
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.mp4') {
            return cb(res.status(400).end('only mp4 file allowed!'), false);
        }
        cb(null, true)
    }
})
   
var upload = multer({ storage: storage }).single("file")

router.post('/uploadfiles', (req, res) => {
    upload(req, res, err => {
        if(err) {
            return res.json({ success: false, err })
        }
        return res.json({ success: true, filePath: res.req.file.path, fileName: res.req.file.filename })
    })
});

router.post('/thumbnails', (req, res) => {

    let thumbsFilePath = "";
    let fileDuration = "";

    ffmpeg.ffprobe(req.body.filePath, function(err, metadata) {
        console.dir(metadata);
        console.log(metadata.format.duration);

        fileDuration = metadata.format.duration;
    })

    ffmpeg(req.body.filePath)
        .on('filenames', function(filenames) {
            console.log('Will generate ' + filenames.join(', '))

            thumbsFilePath = 'uploads/thumbnails/' + filenames[0]; 
        })
        .on('end', function() {
            console.log('Screenshots taken');
            return res.json({ success: true, thumbsFilePath: thumbsFilePath, fileDuration: fileDuration })
        })
        .screenshots({
            // Will take screens at 20%, 40%, 60% and 80% of the video
            count: 3,
            folder: filePath +'/thumbnails/',
            size: '320x240',
            filename: 'thumbnail-%b.png'
        });
});

router.post('/uploadVideo', (req, res) => {
    const video = new Video(req.body)

    video.save((err, video) => {
        if(err) return res.status(400).json({ success: false, err})
        return res.status(200).json({
            success: true,
        })
    })
});

router.get('/getVideos', (req, res) => {
    Video.find()
        .populate('writer')
        .exec((err, videos) => {
            if(err) return res.status(400).send(err);
            res.status(200).json({ success: true, videos })
        })
});

router.post('/getVideo', (req, res) => {
    Video.findOne({ "_id" : req.body.videoId })
        .populate('writer')
        .exec((err, video) => {
            if(err) return res.status(400).send(err);
            res.status(200).json({ success: true, video })
    }) 
});

router.post('/view', (req, res) => {

    Video.findOneAndUpdate({ "_id" : req.body._id }, { 'views' : req.body.views+1 })
        .populate('writer')
        .exec((err, video) => {
            if(err) return res.status(400).send(err);
            res.status(200).json({ success: true, video })
        })
});

router.post('/searchVideo', (req, res) => {
    
    Video.find({ 'title': req.body.title })
    .populate('writer')
    .exec((err, video) => {
        if(err) return res.status(400).send(err);
        res.status(200).json({ success: true, video })
    })
})

export default router;