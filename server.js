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
const productsRouter = require('./routes/products_routes');
const cartsRouter = require('./routes/carts_routes');
const ordersRouter = require('./routes/orders_router');
const cartsOrdersRouter = require('./routes/carts_orders_router');

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

//use productsRouter
app.use('/products', productsRouter);

//use cartsRouter
app.use('/carts', cartsRouter);

//use ordersRouter 
app.use('/orders', ordersRouter);

//use cartsOrdersRouter
app.use('/carts-orders', cartsOrdersRouter);

module.exports = { app };

// Listen for 3001
app.listen(port, () => {
    console.log(`Server started on port ${port}.`)
});