const express = require('express');
const hostrouter = express.Router();
const host = require('../controllers/host');

hostrouter.get('/submitdetails',host.addcar);

hostrouter.post('/submitdetails',host.showcarsadded);

hostrouter.get('/hostcars',host.showhostcars);

hostrouter.post('/delete/:id',host.deletecar);

hostrouter.get('/edit/:id',host.editcar);

hostrouter.post('/edit',host.editcarz);

module.exports = hostrouter;