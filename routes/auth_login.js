const express = require('express');
const loginRouter = express.Router();
const path = require('path');


// Login GET route
loginRouter.get('/', (request, response) => {
  response.sendFile(path.resolve('./static/auth.html'));
  response.status(200).render('Login successful')
});

// // Login POST route: accept user credentials
// loginRouter.post('/login', (req, res) => {
//     // Insert Login Code Here
//     let username = req.body.username;
//     let password = req.body.password;
//     res.send(`Username: ${username} Password: ${password}`);
//   });

  module.exports = loginRouter;
