/**
 * A module to interact with the ShopDB sql database 
 * @module helpers/database
 * @author Jeffrey Ting
 * @see dbCode
 */

const mysql = require('promise-mysql');
const info = require('../config');

/**
 * executes sql queries on ShopDB and returns the result
 * @param {string} query - The SQL query to execute 
 * @param {array} values - The values used in the SQL query 
 * @returns {array<object>} data - The values returned from the query
 * @throws {string} - Error in executing query
 */

//create async function to connect to database
exports.run_query = async function run_query(query, values) {
  try {
    const connection = await mysql.createConnection(info.config);
    let data = await connection.query(query, values);
    await connection.end();
    return data;
  } catch (error) {

    //generate an error incase actual error 
    //has sensitive info 
    console.error(error, query, values);
    throw 'Database query error'
  }
}
