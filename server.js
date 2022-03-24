// Require in server and middleware
const express = require('express');
const app = express();
const port = 3001;
const bodyParser = require('body-parser');
const fs = require('fs');

// Require routers 
const homeRouter = require('./routes/home_route');
const loginRouter = require('./routes/auth_login');
const customersRouter = require('./routes/customers_routes');
const addressesRouter = require('./routes/addresses_routes');


// Set local port
app.set('port', process.env.PORT || 3001);




////////// MIDDLEWARE //////////
// Make body-parser middleware available 
app.set('views', __dirname + '/views'); // general config
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));




////////// ROUTES //////////
//use homeRouter (index.html homepage)
app.use('/', homeRouter);

//use loginRouter
app.use('/auth', loginRouter);

//use customersRouter
app.use('/customers', customersRouter);

//use addressesRouter
app.use('/addresses', addressesRouter);

module.exports = { app };


// Listen for 3001
app.listen(port, () => {
    console.log(`Server started on port ${port}.`)
});