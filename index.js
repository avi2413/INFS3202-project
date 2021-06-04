import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';

import userRoutes from './routes/users.js';
import videoRoutes from './routes/video.js';
import commentRoutes from './routes/comment.js';
import likeRoutes from './routes/likes.js';

const app = express();

app.use(cors());

app.use(express.json({extended: true}));
app.use(express.urlencoded({extended: true}));

app.use('/users', userRoutes);
app.use('/video', videoRoutes);
app.use('/comment', commentRoutes);
app.use('/like', likeRoutes);

app.use('/uploads', express.static('uploads'));

const CONNECTION_URL = 'mongodb+srv://avi:avinash123@cluster0.vxjsl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build')); 
}

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
    .catch((error) => console.log(`${error} did not connect`));

mongoose.set(`useFindAndModify`, false);
