import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/user.js';

export const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const exisingUser = await User.findOne({ email });
        if(!exisingUser) {
            return res.status(404).json( {message: "User not found"} );
        }

        const correctPassword = await bcrypt.compare(password, exisingUser.password);
        if(!correctPassword) {
            return res.status(400).json( {message: "Incorrect Password"} ); 
        }

        const token = jwt.sign(
            { email: exisingUser.email, id: exisingUser._id }, 
            'secret_string_X', 
            { expiresIn: "3h"}
        )
        
        res.status(200).json({ result: exisingUser, token });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong!" });
    }
}

export const signup = async (req, res) => {
    const { email, password, confirmPassword, firstName, lastName } = req.body;

    try {
        const exisingUser = await User.findOne({ email });
        if(exisingUser) {
            return res.status(400).json( {message: "User already exists"} );
        }

        if(password != confirmPassword) {
            return res.status(400).json( {message: "Passwords don't match"} );
        }

        const hashPassword = await bcrypt.hash(password, 12);
        const result =  await User.create({ email, password: hashPassword, name:`${firstName} ${lastName}` });
        const token = jwt.sign(
            { email: result.email, id: result._id }, 
            'secret_string_X', 
            { expiresIn: "3h"}
        )
        res.status(200).json({ result, token });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong!" });
    }
}
