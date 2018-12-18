const express = require('express');
const User = require('../controllers/user');
const router = express.Router();

// Auth Endpoint 
router.post('/auth', User.auth);

// Register Endpoint
router.post('/register', User.register);

module.exports = router;