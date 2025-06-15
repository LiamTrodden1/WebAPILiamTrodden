/**
 * A module containing all the routes and functions for performing the Create Read Update delete (CRUD) options on users
 * @module routes/products
 * @author Liam Trodden
 * @see ../models/products
 */

//Imports
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const model = require('../models/products');
const router = new Router({ prefix: '/api/v1/products' });
const {validateProduct} = require('../controllers/validation')
const {validateUpdateProduct} = require('../controllers/validation')
const auth = require('../controllers/products');
const jwt = require('../controllers/jwt')
const can = require('../permissions/products');

//CRUD routes
/** Route to get all products */
router.get('/', jwt, getAllProduct);
/** Route to get a product */
router.get('/:id', jwt, getByIdProduct);
/** Route to create a product */
router.post('/', bodyParser(), jwt, validateProduct, createProduct);
/** route to update a product */
router.put('/:id', bodyParser(), jwt, validateUpdateProduct, updateProduct);
/** route to delete a product */
router.del('/:id', jwt, deleteProduct);

/**
 * GET all products from the database
 * @function
 * @param {array<object>} ctx - object containing all data of the request
 * @return {void} - Returns error message and status code 403
 * @return {void} - Returns error message and status code 404
 * @return {array<object>} - Returns a list of products and status code 200 
 */
//get all products
async function getAllProduct(ctx) {
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

  //no users exist
  if (!result.length) {
    ctx.status = 404;
    ctx.body = { message: "products not found" };
    return;
  } 
  //return users
  ctx.status = 200;
  ctx.body = result;
}

/**
 * GET a product from the database
 * @function
 * @param {array<object>} ctx - object containing all data of the request
 * @return {void} - Returns error message and status code 400
 * @return {void} - Returns error message and status code 403
 * @return {void} - Returns error message and status code 404
 * @return {array<object>} - Returns a list of the product data and status code 200 
 */
//get a specific product
async function getByIdProduct(ctx) {
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
    ctx.body = {message: "Product ID not found"}
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
  //get product data
  ctx.status = 200;
  ctx.body = idResult[0];
}

/**
 * CREATE a product and store in the products table
 * @function
 * @param {array<object>} ctx - object containing all data of the request
 * @return {void} - Returns error message and status code 400
 * @return {number} - Returns the productID of the created user and a status code 201
 */

//create a new product
async function createProduct(ctx) {
  //get body of request
  const body = ctx.request.body;

  //get permissions
  const permissions = can.create(ctx.state.user);

  //check user permission level
  if (!permissions.granted) {
    ctx.status = 403;
    ctx.body = { message: "Permissions Denied" };
    return;
  }

  //try to add product to database
  let result = await model.add(body);

  //if product couldn't be created
  if (!result) {
    ctx.status = 400;
    ctx.body = {message: "Could not create product"}
    return;
  }

  //product succesfully created
  ctx.status = 201;
  ctx.body = { ID: result.insertId };
}

/**
 * UPDATE a product and store in the products table
 * @function
 * @param {array<object>} ctx - object containing all data of the request
 * @return {void} - Returns error message and status code 400
 * @return {void} - Returns error message and status code 403
 * @return {void} - Returns error message and status code 404
 * @return {void} - Returns a message that the product is succesfully updated and a status code 200
 */

//update an existing product
async function updateProduct(ctx) {
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
    ctx.body = { message: "Product not found" };
    return;
  }

  //check permission level of user
  const permissions = can.update(ctx.state.user, idResult[0]);
  if (!permissions.granted) {
    ctx.status = 403;
    ctx.body = { message: "Permission Denied" };
    return;
  }

  //try update product
  let result = await model.update(body, id);

  // if nothing changed
  if (result.affectedRows === 0){
    ctx.status = 400;
    ctx.body = { error: "product not updated" };
    return;
  }
  //product succesfully updated
  ctx.status = 200 
  ctx.body = {message: "Product Updated"}
}

/**
 * DELETE a product from the database
 * @function
 * @param {array<object>} ctx - object containing all data of the request
 * @return {void} - Returns error message and status code 400
 * @return {void} - Returns error message and status code 403
 * @return {void} - Returns error message and status code 404
 * @return {void} - Returns a message that the product has been deleted and a status code 200 
 */

//delete a product
async function deleteProduct(ctx) {
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
  //try delete product
  let result = await model.del(id);

  //if no changes occured product not deleted
  if (result.affectedRows === 0){
    ctx.status = 404;
    ctx.body = { error: "Product couldn't be found to delete" };
    return;
  }
  //product deleted
  ctx.status = 200 
  ctx.body = {message: "Product Deleted"}
}

module.exports = router;