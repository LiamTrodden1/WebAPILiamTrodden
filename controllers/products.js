/**
 * Middleware to authenticate requests using basic authentication and passport
 * @module controller/products
 * @author Jeffrey Ting
 * @see ../strategies/basic
 */

const passport = require('koa-passport');
const basicAuth = require('../strategies/basic');

passport.use(basicAuth);

/** execute basic authentication */
module.exports = passport.authenticate(['basic'], {session:false});