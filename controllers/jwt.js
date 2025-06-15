/**
 * Middleware to authenticate requests using a JSON Web Token (JWT) with passport
 * @module controllers/jwt
 * @author Liam Trodden
 * @see ../strategies/jwt
 */

//imports
const passport = require('koa-passport');
const JwtStrategy = require('../strategies/jwt');

//use JwtStrategy
passport.use('jwt', JwtStrategy);

/** Execute JWT tokens */
module.exports = passport.authenticate('jwt', { session: false });