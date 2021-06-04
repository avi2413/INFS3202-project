import express from 'express';

import { signin, signup } from '../controllers/user.js'

const router = express.Router();

router.get('/', (req, res) => {
    res.send("Working server!");
})
router.post('/signin', signin);
router.post('/signup', signup);

export default router;