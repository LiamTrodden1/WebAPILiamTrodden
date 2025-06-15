/** 
 * A module to handle database operations for the users table 
 * @module models/users
 * @author Liam Trodden
 * @see ../routes/users
 */

//import database as db
const db = require('../helpers/database');

/** 
 * Get a user by the username
 * @param {string}  - The name for the specific product thats retrieved
 * @returns {array<object>} data - An array containing the product data
 */

//find by name
exports.findByUsername = async function getByUsername(username) {
const query = "SELECT * FROM users WHERE username = ?;";
const user = await db.run_query(query, username);
return user;
}

/** 
 * Get a user by the userID
 * @param {number} id - The ID for the specific user thats retrieved
 * @returns {array<object>} data - An array containing the user data
 */

//find by id
exports.getById = async function getById (id) {
  let query = "SELECT * FROM users WHERE userID = ?";
  let values = [id];
  let data = await db.run_query(query, values);
  return data;
}

/**
 * Get all the users
 * @param {number} page - The page number for pagination
 * @param {number} limit - The maximum number of results per page
 * @param {string} order - order of returns
 * @returns {array<object>} data - An array containing all the users data
 */

//get all 
exports.getAll = async function getAll (page, limit, order) {
  let query = "SELECT * FROM users;";
  let data = await db.run_query(query);
  return data;
}

/**
 * create a new user
 * @param {array<object>} user - An array containing all data to be added in the create
 * @returns {array<number>} data - an array containing the id for the data created
 */

//add to table
exports.add = async function add (user) {
  let query = "INSERT INTO users SET ?";
  let data = await db.run_query(query, user);
  return data;
}

/**
 * update an existing product
 * @param {array<object>} user - An array of all the data to be updated
 * @param {number} id - The ID of the user to update
 */

//update by id
exports.update = async function update(user, id){
  let query = "UPDATE users SET ? WHERE userID = ?"
  let data = await db.run_query(query, [user, id]);
  return data 
}

/**
 * delete an existing user
 * @param {number} id - The id of the user to delete
 * @returns {string} data - A message to notify the deletions success
 */


//delete by id
exports.del = async function del(id){
  let query = "DELETE FROM users WHERE userID = ?"
  let data = await db.run_query(query, [id]);
  return data
}

