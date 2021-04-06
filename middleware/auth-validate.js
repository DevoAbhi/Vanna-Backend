const jwt = require('jsonwebtoken');
const User = require('../models/user')

module.exports = (req, res, next) => {
    try {
        const token = req.get('Authorization').split(" ")[1]

        let user_credentials =jwt.verify(token, process.env.JWT_KEY);

        if(user_credentials){
            req.token = user_credentials;
            
            User.findOne({_id : req.token.user_id})
            .then(user => {
                req.user = user;
                next();
            })
        }
        else{
            throw new Error('Invalid Token!')
        }
        
    }
    catch(error) {

        if(error.name == 'TokenExpiredError') {
            error.message = 'Token has expired.... Please login again.'
        }
        else{
            console.log(error);
            error.message = 'Invalid Token.... Please login again.'
        }
        return res.status(401).json({
            success : false,
            message: error.message
        })
    }
}