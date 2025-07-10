const express = require('express');
const userrouter = express.Router();
const host = require('../controllers/host');

userrouter.get('/',host.home);
userrouter.get('/cars',host.showusercars);

userrouter.post('/addtofavourites/:id',host.getfavourites);   
userrouter.get('/favourites', host.showFavourites);
userrouter.get('/deletefromfavourites/:id',host.deletefav);

userrouter.get('/viewdetails/:id',host.getdetails);


module.exports = userrouter;                