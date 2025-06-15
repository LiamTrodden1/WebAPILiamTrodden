/**
 * A module to define the permisions of the user and admin accounts
 * 
 * This module uses the role based access control system imported from the role-acl module
 * @module permissions/products
 * @author Liam Trodden
 * @see routes/products
 */

//import role-acl with the instance ac
const AccessControl = require('role-acl');
const ac = new AccessControl();

/** 
 * Grant the user permissions to read all products
 * @function
 * @name grantUserReadAll
 */
//user get all products
ac.grant('user')
  .execute('read')
  .on('products');
  
/** 
 * Grant the user permissions to read a product
 * @function
 * @name grantUserRead
 */
//user read a product
ac.grant('user')
  .execute('read')
  .on('product');

/**
 * Grant admins the ability to get all products
 * @function
 * @name grantAdminRead
 */
//admin get all users
ac.grant('admin')
  .execute('read')
  .on('products');

/**
 * Grant admins the ability to get a product
 * @function
 * @name grantAdminRead
 */
//admin read a product
ac.grant('admin')
  .execute('read')
  .on('product');

/**
 * Grant admins the ability to create a product
 * @function
 * @name grantAdminCreate
 */
//admin create a product
ac.grant('admin')
  .execute('create')
  .on('products')

/**
 * grant admins the ability to update a product 
 * @function
 * @name grantAdminUpdate
 */
//admin update a user
ac.grant('admin')
  .execute('update')
  .on('product');

/**
 * Grant admins the ability to delete a roduct
 * @function
 * @name grantAdminDelete
 */
//admin delete a product
ac.grant('admin')
  .execute('delete')
  .on('product');

/**
 * Checks requesters permissions to read all products
 * 
 * @function
 * @name readAll
 * @param {Object} requester - The object containing the role and productID.
 * @returns {boolean} - Returns true if account has permission to read all, else false.
 */
//check requesters permissions for reading all products
exports.readAll = (requester) =>
  ac.can(requester.role)
    .execute('read')
    .sync()
    .on('products');

/**
 * check requesters permissions for reading a product
 * @function
 * @name read
 * @param {Object} requester - The object containing the role and productID.
 * @returns {boolean} - Returns true if account has permission to read, else false.
 */
//check requesters permissions for reading a product
exports.read = (requester, data) =>
  ac.can(requester.role)
  .execute('read')
  .sync()
  .on('product');

/**
 * check requesters permissions for creating a product
 * @function
 * @name create
 * @param {Object} requester - The object containing the role and productID.
 * @returns {boolean} - Returns true if account has permission to read, else false.
 */
//check requesters permissions for creating a product
exports.create = (requester) =>
  ac.can(requester.role)
  .execute('create')
  .sync()
  .on('products');


/**
 * check requesters permissions for updating a product
 * @function
 * @name update
 * @param {Object} requester - The object containing the role and productID.
 * @param {Object} data - contains productID for checking permissions
 * @returns {boolean} - Returns true if account has permission to update, else false.
 */
//check requesters permissions for updating a user
exports.update = (requester, data) =>
  ac.can(requester.role)
  .context({requester:requester.userID,owner:data.userID})
  .execute('update')
  .sync()
  .on('product');

/**
 * check requesters permissions for deleting a product
 * @function
 * @name delete
 * @param {Object} requester - The object containing the role and productID.
 * @param {Object} data - contains productID for checking permissions
 * @returns {boolean} - Returns true if account has permission to update, else false.
 */
//check permissions for delting a user
exports.delete = (requester, data) =>
  ac.can(requester.role)
    .context({requester:requester.userID, owner:data.userID})
    .execute('delete')
    .sync()
    .on('product');
