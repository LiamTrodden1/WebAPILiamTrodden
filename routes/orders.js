/**
 * A module containing all the routes and functions for performing the Create Read Update delete (CRUD) options on users
 * @module routes/orders
 * @author Liam Trodden
 * @see ../models/orders
 */

//Imports
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const model = require('../models/orders');
const router = new Router({ prefix: '/api/v1/orders' });
const {validateOrder} = require('../controllers/validation')
const {validateUpdateOrder} = require('../controllers/validation')
const auth = require('../controllers/auth');
const jwt = require('../controllers/jwt')
const can = require('../permissions/orders');

//CRUD routes
/** Route to get all orders */
router.get('/', jwt, getAllOrders);
/** Route to get an order */
router.get('/:id', jwt,getByIdOrder);
/** Route to create an order */
router.post('/', bodyParser(), jwt,  validateOrder, createOrder);
/** route to update an order */
router.put('/:id', bodyParser(), jwt, validateUpdateOrder, updateOrder);

/**
 * GET all orders from the database
 * @function
 * @param {array<object>} ctx - object containing all data of the request
 * @return {void} - Returns error message and status code 403
 * @return {void} - Returns error message and status code 404
 * @return {array<object>} - Returns a list of orders and status code 200 
 */
//get all orders
async function getAllOrders(ctx) {
  //get user read all permissions
  const permissions = can.readAll(ctx.state.user);

  //check users permission level
  if (!permissions.granted) {
    ctx.status = 403;
    ctx.body = { message: "Permission Denied" };
    return;
  } 
  //try to get all
  const result = await model.getAll();

  //no orders exist
  if (!result.length) {
    ctx.status = 404;
    ctx.body = { message: "Order not found" };
    return;
  } 
  //return users
  ctx.status = 200;
  ctx.body = result;
}

/**
 * GET an order from the database
 * @function
 * @param {array<object>} ctx - object containing all data of the request
 * @return {void} - Returns error message and status code 400
 * @return {void} - Returns error message and status code 403
 * @return {void} - Returns error message and status code 404
 * @return {array<object>} - Returns a list of the order data and status code 200 
 */
//get a specific order
async function getByIdOrder(ctx) {
  //get the id from request parameters
  let id = ctx.params.id;
  
  //check id correctly formatted
  let format = /[1-9]\d*/;
  if (!format.test(id)) {
    ctx.status = 400;
    ctx.body = { message: "Invalid ID" };
    return;
  }
  //get id of user making request
  const idResult = await model.getById(id);

  //check if user can be found
  if (!idResult.length){
    ctx.status = 404;
    ctx.body = {message: "Order ID not found"}
    return;
  }
  //get permissions
  const permissions = can.read(ctx.state.user, idResult[0]);

  //check user permission level
  if (!permissions.granted) {
    ctx.status = 403;
    ctx.body = { message: "Permissions Denied" };
    return;
  }
  //get order data
  ctx.status = 200;
  ctx.body = idResult[0];
}

/**
 * CREATE an order and store in the orders table
 * @function
 * @param {array<object>} ctx - object containing all data of the request
 * @return {void} - Returns error message and status code 400
 * @return {number} - Returns the userID of the created payment and a status code 201
 */
//create a new order
async function createOrder(ctx) {
  //get body of request
  const body = ctx.request.body;

  //try to add order to database
  let result = await model.add(body);

  //if order couldn't be created
  if (!result) {
    ctx.status = 400;
    ctx.body = {message: "Could not create order"}
    return;
  }

  //order succesfully created
  ctx.status = 201;
  ctx.body = { ID: result.insertId };
}

/**
 * UPDATE an order and store in the orders table
 * @function
 * @param {array<object>} ctx - object containing all data of the request
 * @return {void} - Returns error message and status code 400
 * @return {void} - Returns error message and status code 403
 * @return {void} - Returns error message and status code 404
 * @return {void} - Returns a message that the order is succesfully updated and a status code 200
 */
//update an existing user
async function updateOrder(ctx) {
  //get request body and id from parameters 
  const body = ctx.request.body;
  let id = ctx.params.id;

  //check for valid id
  let format = /[1-9]\d*/;
  if (!format.test(id)) {
    ctx.status = 400;
    ctx.body = { message: "Invalid ID" };
    return;
  }
  //get requesting users data
  let idResult = await model.getById(id);

  //check user exists
  if (!idResult.length) {
    ctx.status = 404;
    ctx.body = { message: "Order not found" };
    return;
  }

  //check permission level of user
  const permissions = can.update(ctx.state.user, idResult[0]);
  if (!permissions.granted) {
    ctx.status = 403;
    ctx.body = { message: "Permission Denied" };
    return;
  }

  //only order status can be updated
  delete body.productID;
  delete body.userID;
  delete body.paymentID;
  delete body.orderDate;
  delete body.postcode;
  delete body.quantity;

  //try update order
  let result = await model.update(body, id);

  // if nothing changed
  if (result.affectedRows === 0){
    ctx.status = 400;
    ctx.body = { error: "Order not updated" };
    return;
  }
  //order succesfully updated
  ctx.status = 200 
  ctx.body = {message: "Order Updated"}
}


module.exports = router;