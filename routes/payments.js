/**
 * A module containing all the routes and functions for performing the Create Read Update delete (CRUD) options on users
 * @module routes/payments
 * @author Liam Trodden
 * @see ../models/payments
 */

//Imports
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const model = require('../models/payments');
const router = new Router({ prefix: '/api/v1/payments' });
const {validatePayment} = require('../controllers/validation');
const {validateUpdatePayment} = require('../controllers/validation');
const auth = require('../controllers/auth');
const jwt = require('../controllers/jwt')
const can = require('../permissions/payments');

//CRUD routes
/** Route to get all payments */
router.get('/', jwt, getAllPayment);
/** Route to get a payment */
router.get('/:id', jwt ,getByIdPayment);
/** Route to create a payment */
router.post('/', bodyParser(), jwt,  validatePayment, createPayment);
/** route to update a payment */
router.put('/:id', bodyParser(), jwt, validateUpdatePayment, updatePayment);

/**
 * GET all payments from the database
 * @function
 * @param {array<object>} ctx - object containing all data of the request
 * @return {void} - Returns error message and status code 403
 * @return {void} - Returns error message and status code 404
 * @return {array<object>} - Returns a list of payments and status code 200 
 */
//get all payments
async function getAllPayment(ctx) {
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

  //no payments exist
  if (!result.length) {
    ctx.status = 404;
    ctx.body = { message: "Payment not found" };
    return;
  } 
  //return users
  ctx.status = 200;
  ctx.body = result;
}

/**
 * GET a payment from the database
 * @function
 * @param {array<object>} ctx - object containing all data of the request
 * @return {void} - Returns error message and status code 400
 * @return {void} - Returns error message and status code 403
 * @return {void} - Returns error message and status code 404
 * @return {array<object>} - Returns a list of the payment data and status code 200 
 */
//get a specific payment
async function getByIdPayment(ctx) {
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
    ctx.body = {message: "Payment ID not found"}
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
  //get payment data
  ctx.status = 200;
  ctx.body = idResult[0];
}

/**
 * CREATE a payment and store in the payments table
 * @function
 * @param {array<object>} ctx - object containing all data of the request
 * @return {void} - Returns error message and status code 400
 * @return {number} - Returns the userID of the created payment and a status code 201
 */
//create a new payment
async function createPayment(ctx) {
  //get body of request
  const body = ctx.request.body;

  //try to add payment to database
  let result = await model.add(body);

  //if payment couldn't be created
  if (!result) {
    ctx.status = 400;
    ctx.body = {message: "Could not create payment"}
    return;
  }

  //payment succesfully created
  ctx.status = 201;
  ctx.body = { ID: result.insertId };
}

/**
 * UPDATE a payment and store in the payments table
 * @function
 * @param {array<object>} ctx - object containing all data of the request
 * @return {void} - Returns error message and status code 400
 * @return {void} - Returns error message and status code 403
 * @return {void} - Returns error message and status code 404
 * @return {void} - Returns a message that the payment is succesfully updated and a status code 200
 */
//update an existing user
async function updatePayment(ctx) {
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

  //check payment exists
  if (!idResult.length) {
    ctx.status = 404;
    ctx.body = { message: "Payment not found" };
    return;
  }

  //check permission level of user
  const permissions = can.update(ctx.state.user, idResult[0]);
  if (!permissions.granted) {
    ctx.status = 403;
    ctx.body = { message: "Permission Denied" };
    return;
  }

  //only payment status can be updated
  delete body.orderID;
  delete body.userID;
  delete body.cost;
  delete body.paymentDate;

  //try update payment
  let result = await model.update(body, id);

  // if nothing changed
  if (result.affectedRows === 0){
    ctx.status = 400;
    ctx.body = { error: "Payment not updated" };
    return;
  }
  //payment succesfully updated
  ctx.status = 200 
  ctx.body = {message: "Payment Updated"}
}

//payments shouldnt be deleted

module.exports = router;