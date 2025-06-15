/**
 * Main file that connects the routes oall teh routes of teh api
 */
// import koa framework
const Koa = require('koa');

//create new app
const app = new Koa();

//route paths 
const products = require('./routes/products.js');
const users = require('./routes/users.js');
const payments = require('./routes/payments.js');
const orders = require('./routes/orders.js');
const blogin = require('./routes/login.js');
const cors = require('@koa/cors');

/**
 * Function to enable Cross-Origin Resource Sharing (CORS) which allows the application to perform requests from the api 
 */
app.use(cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization']
}));

//execute routes
app.use(products.routes());
app.use(users.routes());
app.use(payments.routes());
app.use(orders.routes());
app.use(blogin.routes());


module.exports = app;