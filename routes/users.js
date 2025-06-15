/**
 * A module containing all the routes and functions for performing the Create Read Update delete (CRUD) options on users
 * @module routes/users
 * @author Liam Trodden
 * @see ../models/users
 */

//Imports
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const model = require('../models/users');
const router = new Router({ prefix: '/api/v1/users' });
const {validateUser} = require('../controllers/validation')
const {validateUpdateUser} = require('../controllers/validation')
const auth = require('../controllers/auth');
const jwt = require('../controllers/jwt')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const can = require('../permissions/users');

//CRUD routes
/** Route to get all users */
router.get('/', jwt, getAllUser);
/** Route to create a user */
router.post('/', bodyParser(), validateUser, createUser);
/** Route to get a user */
router.get('/:id', jwt, getByIdUser); 
/** route to update a user */
router.put('/:id', bodyParser(), jwt , validateUpdateUser, updateUser);
/** route to delete a user */
router.del('/:id', jwt, deleteUser);

/**
 * GET all users from the database
 * @function
 * @param {array<object>} ctx - object containing all data of the request
 * @return {void} - Returns error message and status code 403
 * @return {void} - Returns error message and status code 404
 * @return {array<object>} - Returns a list of users and status code 200 
 */
//get all users
async function getAllUser(ctx) {
  //get user read all permissions
  console.log(ctx.state.user, "hello");
  const permissions = can.readAll(ctx.state.user);

  //check users permission level
  if (!permissions.granted) {
    ctx.status = 403;
    ctx.body = { message: "Permission Denied" };
    return;
  } 
  //try to get all
  const result = await model.getAll();

  //no users exist
  if (!result.length) {
    ctx.status = 404;
    ctx.body = { message: "Users not found" };
    return;
  } 
  //return users
  ctx.status = 200;
  ctx.body = result;
}

/**
 * GET a user from the database
 * @function
 * @param {array<object>} ctx - object containing all data of the request
 * @return {void} - Returns error message and status code 400
 * @return {void} - Returns error message and status code 403
 * @return {void} - Returns error message and status code 404
 * @return {array<object>} - Returns a list of the user data and status code 200 
 */
//get a specific user
async function getByIdUser(ctx) {
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
    ctx.body = {message: "User ID not found"}
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
  //get users data
  ctx.status = 200;
  ctx.body = idResult[0];
}

/**
 * CREATE a user and store in the users table
 * @function
 * @param {array<object>} ctx - object containing all data of the request
 * @return {void} - Returns error message and status code 400
 * @return {number} - Returns the userID of the created user and a status code 201
 */

//create a new user
async function createUser(ctx) {
  //get body of request
  const body = ctx.request.body;

  //encrypt password
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(body.password, salt);
  body.password = hashedPassword;

  //try to add to user to database
  let result = await model.add(body);

  //if user couldn't be created
  if (!result) {
    ctx.status = 400;
    ctx.body = {message: "Could not create user"}
    return;
  }
  //user succesfully created
  ctx.status = 201;
  ctx.body = { ID: result.insertId };
}

/**
 * UPDATE a user and store in the users table
 * @function
 * @param {array<object>} ctx - object containing all data of the request
 * @return {void} - Returns error message and status code 400
 * @return {void} - Returns error message and status code 403
 * @return {void} - Returns error message and status code 404
 * @return {void} - Returns a message that the user is succesfully updated and a status code 200
 */

//update an existing user
async function updateUser(ctx) {
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
    ctx.body = { message: "User not found" };
    return;
  }

  //check permission level of user
  const permissions = can.update(ctx.state.user, idResult[0]);
  if (!permissions.granted) {
    ctx.status = 403;
    ctx.body = { message: "Permission Denied" };
    return;
  }

  //only admin can update role
  if (ctx.state.user.role !== "admin") {
    delete body.role;
  }

  //encrypt password if its in the response body
  if (body.password){
    //encrypt password
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(body.password, salt);
    body.password = hashedPassword;
  }

  //try update user
  let result = await model.update(body, id);

  // if nothing changed
  if (result.affectedRows === 0){
    ctx.status = 400;
    ctx.body = {message: "User not updated" };
    return;
  }
  //user succesfully updated
  ctx.status = 200 
  ctx.body = {message: "User Updated"}
}

/**
 * DELETE a user from the database
 * @function
 * @param {array<object>} ctx - object containing all data of the request
 * @return {void} - Returns error message and status code 400
 * @return {void} - Returns error message and status code 403
 * @return {void} - Returns error message and status code 404
 * @return {void} - Returns a message that the user has been deleted and a status code 200 
 */

//delete a user
async function deleteUser(ctx) {
  //get id from request parameters
  let id = ctx.params.id;

  //check id format
  let format = /[1-9]\d*/;
  if (!format.test(id)) {
    ctx.status = 400;
    ctx.body = { message: "Invalid ID" };
    return;
  }
  //get data of requesting user
  let idResult = await model.getById(id);

  //check users permissions to delete
  const permissions = can.delete(ctx.state.user, idResult[0]);
  if (!permissions.granted) {
    ctx.status = 403;
    ctx.body = { message: "Permission Denied" };
    return;
  }
  //try delete user
  let result = await model.del(id);

  //if no changes occured user not deleted
  if (result.affectedRows === 0){
    ctx.status = 404;
    ctx.body = { error: "User couldn't be found to delete" };
    return;
  }
  //user deleted
  ctx.status = 200 
  ctx.body = {message: "User Deleted"}
}

module.exports = router;
