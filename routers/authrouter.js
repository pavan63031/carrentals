const express = require('express');
const authrouter = express.Router();
const auth = require('../controllers/host');

authrouter.get('/login',auth.getLogin);
authrouter.post('/login',auth.postLogin);
authrouter.post('/logout', auth.postLogout);
authrouter.get('/signup',auth.getSignup);
authrouter.post('/signup',auth.postSignup);

module.exports = authrouter;