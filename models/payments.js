/** 
 * A module to handle database operations for the payments table 
 * @module models/payments
 * @author Liam Trodden
 * @see ../routes/payments
 */

//import database as db
const db = require('../helpers/database');

/** 
 * Get a payment by the paymentID
 * @param {number} id - The ID for the specific payment thats retrieved
 * @returns {array<object>} data - An array containing the payment data
 */

//find by id
exports.getById = async function getById (id) {
  let query = "SELECT * FROM payments WHERE paymentID = ?";
  let values = [id];
  let data = await db.run_query(query, values);
  return data;
}

/**
 * Get all the payments
 * @param {number} page - The page number for pagination
 * @param {number} limit - The maximum number of results per page
 * @param {string} payment - order of returns
 * @returns {array<object>} data - An array containing all the payments data
 */

//get all 
exports.getAll = async function getAll (page, limit, payment) {
  let query = "SELECT * FROM payments;";
  let data = await db.run_query(query);
  return data;
}

/**
 * create a new payment
 * @param {array<object>} payment - An array containing all data to be added in the create
 * @returns {array<number>} data - an array containing the id for the data created
 */

//add to table
exports.add = async function add (payment) {
  let query = "INSERT INTO payments SET ?";
  let data = await db.run_query(query, payment);
  return data;
}

/**
 * update an existing payment
 * @param {array<object>} payment - An array of all the data to be updated
 * @param {number} id - The ID of the payment to update
 */

//update by id
exports.update = async function update(payment, id){
  let query = "UPDATE payments SET ? WHERE paymentID = ?"
  let data = await db.run_query(query, [payment, id]);
  return data 
}


