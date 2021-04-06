const express = require('express')
const router = express.Router()
const isAuthenticated = require('../middleware/auth-validate');

const authController = require('../controller/auth');

// Post Routes
router.post('/signup', authController.postSignup)
router.post('/login', authController.postLogin)

// Get Routes
router.get('/user-details', isAuthenticated, authController.getUserDetails)

module.exports = router;