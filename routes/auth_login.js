const express = require('express');
const loginRouter = express.Router();
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const crypto = require('crypto');
// const db = require('../db');


// Login GET route
loginRouter.get('/', (request, response) => {
  response.sendFile(path.resolve('./public/auth.html'));
  response.status(200)
});

// // Login POST route: accept user credentials
// loginRouter.post('/login', (req, res) => {
//     // Insert Login Code Here
//     let username = req.body.username;
//     let password = req.body.password;
//     res.send(`Username: ${username} Password: ${password}`);
//   });

  module.exports = loginRouter;
