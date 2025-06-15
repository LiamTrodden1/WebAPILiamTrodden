/**
 * A module to handle database operations for the orders table 
 * @module models/orders
 * @author Liam Trodden
 * @see ../routes/orders
 */

//import database as db
const db = require('../helpers/database');

/** 
 * Get an order by the orderID
 * @param {number} id - The ID for the specific order thats retrieved
 * @returns {array<object>} data - An array containing the order data
 */

//find by id
exports.getById = async function getById (id) {
  let query = "SELECT * FROM orders WHERE orderID = ?";
  let values = [id];
  let data = await db.run_query(query, values);
  return data;
}

/**
 * Get all the orders
 * @param {number} page - The page number for pagination
 * @param {number} limit - The maximum number of results per page
 * @param {string} order - order of returns
 * @returns {array<object>} data - An array containing all the orders data
 */

//get all 
exports.getAll = async function getAll (page, limit, order) {
  let query = "SELECT * FROM orders;";
  let data = await db.run_query(query);
  return data;
}

/**
 * create a new order 
 * @param {array<object>} order - An array containing all data to be added in the create
 * @returns {array<number>} data - an array containing the id for the data created
 */
//add to table
exports.add = async function add (order) {
  let query = "INSERT INTO orders SET ?";
  let data = await db.run_query(query, order);
  return data;
}

/**
 * update an existing order
 * @param {array<object>} order - An array of all the data to be updated 
 * @param {number} id - The ID of the order to update
 */

//update by id
exports.update = async function update(order, id){
  let query = "UPDATE orders SET ? WHERE orderID = ?"
  let data = await db.run_query(query, [order, id]);
  return data 
}