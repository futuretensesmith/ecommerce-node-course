// ***** set up all of the routes and import the controllers *****
const express = require('express');
const router = express.Router();

const { register, login, logout } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);

module.exports = router;

