/**
 * A module to define the permisions of the user and admin accounts
 * 
 * This module uses the role based access control system imported from the role-acl module
 * @module permissions/payments
 * @author Liam Trodden
 * @see routes/payments
 */


//import role-acl with the instance ac
const AccessControl = require('role-acl');
const ac = new AccessControl();

/** 
 * Grant the user permissions to read a payment
 * @function
 * @name grantUserRead
 */
//allow users to read their own payment details
ac.grant('user')
  .condition({ Fn: 'EQUALS', args: { requester: '$.owner' } })
  .execute('read')
  .on('payment');

/** Grant users permissons to create a payment
 * @function
 * @name grantUserCreate
 */
//user create payment
ac.grant('user')
  .execute('create')
  .on('payments')


/**
 * Grant admins the ability to get all payments
 * @function
 * @name grantAdminRead
 */
//admin get all payments
ac.grant('admin')
  .execute('read')
  .on('payments');

/**
 * Grant admins the ability to get a payment
 * @function
 * @name grantAdminRead
 */
//admin get a payment
ac.grant('admin')
  .execute('read')
  .on('payment');

/**
 * Grant admins the ability to update a payment
 * @function
 * @name grantAdminUpdate
 */
//admin update a payment
ac.grant('admin')
  .execute('update')
  .on('payment');

/**
 * Checks requesters permissions to read all payments
 * 
 * @function
 * @name readAll
 * @param {Object} requester - The object containing the role and paymentID.
 * @returns {boolean} - Returns true if account has permission to read all, else false.
 */
//check requesters permissions for reading all payments
exports.readAll = (requester) =>
  ac.can(requester.role)
    .execute('read')
    .sync()
    .on('payments');

/**
 * check requesters permissions for reading a payment
 * @function
 * @name read
 * @param {Object} requester - The object containing the role and paymentID.
 * @returns {boolean} - Returns true if account has permission to read, else false.
 */
//check requesters permissions for reading a payment
exports.read = (requester, data) =>
  ac.can(requester.role)
  .context({requester:requester.userID,owner:data.userID})
  .execute('read')
  .sync()
  .on('payment');

/**
 * check requesters permissions for updating a payment
 * @function
 * @name update
 * @param {Object} requester - The object containing the role and paymentID.
 * @param {Object} data - contains paymentID for checking permissions
 * @returns {boolean} - Returns true if account has permission to update, else false.
 */
//check requesters permissions for updating a payment
exports.update = (requester, data) =>
  ac.can(requester.role)
  .context({requester:requester.userID,owner:data.userID})
  .execute('update')
  .sync()
  .on('payment');