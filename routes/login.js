const express = require('express');
const server = express();
// const bodyParser = require('body-parser');
// const fs = require('fs');

//
server.get('/login', function(req, res, next) {
    res.render('login');
  });
