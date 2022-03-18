// Require in server and middleware
const express = require('express');
const app = express();
const port = 3001;
const bodyParser = require('body-parser');
const fs = require('fs');

// Require in routers (require('./filepath/customers')) etc...
const homeRouter = require('./routes/home_route');
const loginRouter = require('./routes/auth_login');

// Set local port
app.set('port', process.env.PORT || 3001);




////////// MIDDLEWARE //////////
// Make body-parser middleware available 
app.use(bodyParser.urlencoded({ extended: false }));




////////// ROUTES //////////
//use homeRouter (index.html homepage)
app.use('/', homeRouter);

//use loginRouter
app.use('/auth', loginRouter);






// Listen for 3001
app.listen(port, () => {
    console.log(`Server started on port ${port}.`)
});
