import jwt from 'jsonwebtoken';

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const isCustomAuth = token.length < 500; // >500 means google auth

        console.log('Token is:', token);
        let decryptedData;

        if(token  && isCustomAuth) {
            decryptedData = jwt.verify(token, 'secret_string_X');
            req.userId = decryptedData?.id;
        } else {
            decryptedData = jwt.decode(token);
            req.userId = decryptedData?.sub;
        }
        next();
    } catch (error) {
        console.log(error);
    }
} 

export default auth;