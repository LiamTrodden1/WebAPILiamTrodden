/**
 * Middleware to authenticate requests using basic authentication and passport 
 * @module controllers/auth
 * @author Jeffrey Ting
 * @see ../strategies.basic
 */

//imports
const passport = require('koa-passport');
const basicAuth = require('../strategies/basic');

//use basicAuth
passport.use(basicAuth);

/** execute basic authentication */
module.exports = passport.authenticate(['basic'], {session:false});

