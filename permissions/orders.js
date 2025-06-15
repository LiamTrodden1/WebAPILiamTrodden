/**
 * A module to define the permisions of the user and admin accounts
 * 
 * This module uses the role based access control system imported from the role-acl module
 * @module permissions/orders
 * @author Liam Trodden
 * @see routes/orders
 */

//import role-acl with the instance ac
const AccessControl = require('role-acl');
const ac = new AccessControl();

/** 
 * Grant the user permissions to read an order
 * @function
 * @name grantUserRead
 */
//allow users to read their own order details
ac.grant('user')
  .condition({ Fn: 'EQUALS', args: { requester: '$.owner' } })
  .execute('read')
  .on('order');

/**
 * Grant admins the ability to get all orders
 * @function
 * @name grantAdminRead
 */
//admin get all orders
ac.grant('admin')
  .execute('read')
  .on('orders');

/**
 * Grant admins the ability to get an order
 * @function
 * @name grantAdminRead
 */
//admin get an order
ac.grant('admin')
  .execute('read')
  .on('order');

/**
 * Grant admins the ability to update an order
 * @function
 * @name grantAdminUpdate
 */
//admin update a order
ac.grant('admin')
  .execute('update')
  .on('order');


/**
 * Checks requesters permissions to read all orders
 * 
 * @function
 * @name readAll
 * @param {Object} requester - The object containing the role and orderID.
 * @returns {boolean} - Returns true if account has permission to read all, else false.
 */
//check requesters permissions for reading all orders
exports.readAll = (requester) =>
  ac.can(requester.role)
    .execute('read')
    .sync()
    .on('orders');

/**
 * check requesters permissions for reading an order
 * @function
 * @name read
 * @param {Object} requester - The object containing the role and orderID.
 * @returns {boolean} - Returns true if account has permission to read, else false.
 */
//check requesters permissions for reading a user
exports.read = (requester, data) =>
  ac.can(requester.role)
  .context({requester:requester.userID,owner:data.userID})
  .execute('read')
  .sync()
  .on('order');

/**
 * check requesters permissions for updating an order
 * @function
 * @name update
 * @param {Object} requester - The object containing the role and orderID.
 * @param {Object} data - contains orderID for checking permissions
 * @returns {boolean} - Returns true if account has permission to update, else false.
 */
//check requesters permissions for updating an order
exports.update = (requester, data) =>
  ac.can(requester.role)
  .context({requester:requester.userID,owner:data.userID})
  .execute('update')
  .sync()
  .on('order');