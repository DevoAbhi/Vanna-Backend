const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.postSignup = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const address1 = req.body.address1;
    const address2  = req.body.address2;
    const city = req.body.city;
    const state = req.body.state;
    const pin = req.body.pin;
    const password = req.body.password;
    
    User.findOne({email: email}, (err, user) => {
        if(err){
            console.log(err);
            return res.status(500).json({
                success: false,
                message: err.message
            })
        }
        if(user) {
            return res.status(500).json({
                success: false,
                message:"User is already registered"
            })
        }

        return bcrypt.hash(password, 12).then(hashedPassword => {
            
            const user = new User({
                name : name,
                email: email,
                phone: phone,
                address1: address1,
                address2: address2,
                city: city,
                state: state,
                pin: pin,
                password: hashedPassword
            })

            return user.save();
        })
        .then( result => {
            // if(err){
            //     console.log(result)
            //     console.log(err)
            //     return res.status(500).json({
            //         success: false,
            //         message: "Something went wrong while saving"
            //     })
            // }
            if(result){
                console.log("User has been registered!");
                res.status(201).json({
                success: true,
                message:"User has been registered successfully"
            })
            }
            
        })
        .catch(err => {
            console.log(err)
            
            if(err){
                res.status(500).json({
                    success: false,
                    message: "Something went wrong while saving the user!"
                })
            }
        })
    })
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let fetchedUser;

    User.findOne({ email : email })
        .then(user => {
            if(!user){
                return res.status(404).json({
                    success: false,
                    message: "User is not registered! Please Sign Up..."
                })
            }
            fetchedUser = user;

            return bcrypt.compare(password, user.password)
        })
            .then(isMatching => {
                if(!isMatching) {
                    return res.status(401).json({
                        success: false,
                        message: "Password does not match"
                    })
                }

                const token = jwt.sign(
                    {
                        email: fetchedUser.email,
                        user_id: fetchedUser._id
                    },
                    process.env.JWT_KEY,
                    { expiresIn: '1hr' }
                );

                res.status(200).json({
                    success: true,
                    message: 'User has been logged in!',
                    token: token,
                    expiresIn: 3600
                })
            })
            .catch(err => {
                return res.status(500).json({
                    message: 'Something went wrong decripting password'
                })
            })

}

exports.getUserDetails = (req, res, next) => {

    try{
        if(req.user){

            res.status(200).json({
                success: true,
                // name: req.user.name,
                // email: req.user.email,
                // phone: req.user.phone,
                // address1: req.user.address1,
                // address2: req.user.address2,
                // city: req.user.city,
                // state: req.user.state,
                // pin: req.user.pin,
                userDetails: [
                    {name: req.user.name,
                    email: req.user.email,
                    phone: req.user.phone,
                    address1: req.user.address1,
                    address2: req.user.address2,
                    city: req.user.city,
                    state: req.user.state,
                    pin: req.user.pin}
                ]
            })
        }
    }
    catch(err) {
        res.status(500).json({
            success: false,
            message: "Something went wrong getting the user!"
        })
    }

    
}