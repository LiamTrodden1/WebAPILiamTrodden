/** 
 * A module to handle database operations for the products table 
 * @module models/products
 * @author Liam Trodden
 * @see ../routes/products
 */

//import database as db
const db = require('../helpers/database');

/** 
 * Get a product by the product name
 * @param {string}  - The name for the specific product thats retrieved
 * @returns {array<object>} data - An array containing the product data
 */

//find by name
exports.findByUsername = async function getByproduct(name) {
const query = "SELECT * FROM products WHERE name = ?;";
const user = await db.run_query(query, namename);
return user;
}

/** 
 * Get a product by the productID
 * @param {number} id - The ID for the specific product thats retrieved
 * @returns {array<object>} data - An array containing the product data
 */

//find by id
exports.getById = async function getById (id) {
  let query = "SELECT * FROM products WHERE productID = ?";
  let values = [id];
  let data = await db.run_query(query, values);
  return data;
}

/**
 * Get all the products
 * @param {number} page - The page number for pagination
 * @param {number} limit - The maximum number of results per page
 * @param {string} order - order of returns
 * @returns {array<object>} data - An array containing all the products data
 */

//get all 
exports.getAll = async function getAll (page, limit, order) {
  let query = "SELECT * FROM products;";
  let data = await db.run_query(query);
  return data;
}

/**
 * create a new product
 * @param {array<object>} product - An array containing all data to be added in the create
 * @returns {array<number>} data - an array containing the id for the data created
 */

//add to table
exports.add = async function add (product) {
  let query = "INSERT INTO products SET ?";
  let data = await db.run_query(query, product);
  return data;
}

/**
 * update an existing product
 * @param {array<object>} product - An array of all the data to be updated
 * @param {number} id - The ID of the product to update
 */

//update by id
exports.update = async function update(product, id){
  let query = "UPDATE products SET ? WHERE productID = ?"
  let data = await db.run_query(query, [product, id]);
  return data 
}

/**
 * delete an existing product
 * @param {number} id - The id of the product to delete
 * @returns {string} data - A message to notify the deletions success
 */

//delete by id
exports.del = async function del(id){
  let query = "DELETE FROM products WHERE productID = ?"
  let data = await db.run_query(query, [id]);
  return data
}


