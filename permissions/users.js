/**
 * A module to define the permisions of the user and admin accounts
 * 
 * This module uses the role based access control system imported from the role-acl module
 * @module permissions/users
 * @author Jeffrey Ting, Liam Trodden
 * @see routes/users
 */


//import role-acl with the instance ac
const AccessControl = require('role-acl');
const ac = new AccessControl();


/** 
 * Grant the user permissions to read their own data but not password and passwordSalt
 * @function
 * @name grantUserRead
 */
//allow user role to read all their own user data except password and salt
ac.grant('user')
  .condition({ Fn: 'EQUALS', args: { requester: '$.owner' } })
  .execute('read')
  .on('user', ['*', '!password', '!passwordSalt']);

/**
 * Grant the user permission to update their name and password
 * @function
 * @name grantUserUpdate
 */
//allow user to update their own username email password
ac.grant('user')
  .condition({ Fn: 'EQUALS', args: { requester: '$.owner' } })
  .execute('update')
  .on('user', ['username', 'email', 'password']);

/**
 * Grant admins the ability to get a user
 * @function
 * @name grantAdminRead
 */
//admin get a user
ac.grant('admin')
  .execute('read')
  .on('user');

/**
 * Grant admins the ability to get all users
 * @function 
 * @name grantAdminReadAll
 */
//admin get all users
ac.grant('admin')
  .execute('read')
  .on('users');

/**
 * grant admins the ability to update a user 
 * @function
 * @name grantAdminUpdate
 */
//admin update a user
ac.grant('admin')
  .execute('update')
  .on('user');

/**
 * Grant admins the ability to delete users but not themselves
 * @function
 * @name grantAdminDelete
 */
//admin delete a user but not themselves
ac.grant('admin')
  .condition({Fn:'NOT_EQUALS', args:{requester:'$.owner'}})
  .execute('delete')
  .on('user');


/**
 * Checks requesters permissions to read all users
 * 
 * @function
 * @name readAll
 * @param {Object} requester - The object containing the role and userID.
 * @returns {boolean} - Returns true if account has permission to read all, else false.
 */
//check requesters permissions for reading all users
exports.readAll = (requester) =>
  ac.can(requester.role)
    .execute('read')
    .sync()
    .on('users');

/**
 * check requesters permissions for reading a user 
 * @function
 * @name read
 * @param {Object} requester - The object containing the role and userID.
 * @returns {boolean} - Returns true if account has permission to read, else false.
 */
//check requesters permissions for reading a user
exports.read = (requester, data) =>
  ac.can(requester.role)
  .context({requester:requester.userID,owner:data.userID})
  .execute('read')
  .sync()
  .on('user');

/**
 * check requesters permissions for updating a user
 * @function
 * @name update
 * @param {Object} requester - The object containing the role and userID.
 * @param {Object} data - contains userID for checking permissions
 * @returns {boolean} - Returns true if account has permission to update, else false.
 */
//check requesters permissions for updating a user
exports.update = (requester, data) =>
  ac.can(requester.role)
  .context({requester:requester.userID,owner:data.userID})
  .execute('update')
  .sync()
  .on('user');

/**
 * check requesters permissions for deleting a user
 * @function
 * @name delete
 * @param {Object} requester - The object containing the role and userID.
 * @param {Object} data - contains userID for checking permissions
 * @returns {boolean} - Returns true if account has permission to update, else false.
 */
//check permissions for delting a user
exports.delete = (requester, data) =>
  ac.can(requester.role)
    .context({requester:requester.userID, owner:data.userID})
    .execute('delete')
    .sync()
    .on('user');