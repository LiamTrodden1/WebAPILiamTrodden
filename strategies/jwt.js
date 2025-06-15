/** 
 * A module for performing jwt authentication
 * @module strategies/jwt
 * @author Liam Trodden
 * @see ../controllers/jwt
 */

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const model = require('../models/users');

/**
 * Extract jwt tokens from the header and store secret key
 * @property {function} jwtFromRequest - Function to get the jwt token from response
 * @property {string} secretOrKey - Secret key for JWT token verfification
 */
//https://www.passportjs.org/packages/passport-jwt/
//extract header as bearer token and get secret key
let opts = {
  //get jwt token from header, verify token 
  jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey : 'secret'
}

/**
 * Decipher if a user is authenticated based on the jwt token payload 
 * @function
 * @param {object} jwtPayload - the decoded payload of the userID and username
 * @param {function} done - passes the resuts of authentication
 * @returns {object} - if correct details
 * @returns {false} - if incorrect details
 * @returns {false} - If an error occured in authentication
 */
//passport stategy for JWT
const jwtAuthenticate = async (jwtPayload, done) => {
  //check user in database using userID
  try {
    const id = jwtPayload.sub;
    const user = await model.getById(id);
    if (user) {
      return done(null, user[0]);
    } else {
      return done(null, false)
    }
  }
  catch (error) {
    return done(error, false);
  }
};


const strategy = new JwtStrategy(opts, jwtAuthenticate);
module.exports = strategy;

