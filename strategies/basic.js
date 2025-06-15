/** 
 * A module for performing a basic authentication strategy and to generate a jwt token
 * @module strategies/basic
 * @author Jeffrey Ting, Liam Trodden
 * @see ../controllers/auth.js
 */

//imports
const passport = require('koa-passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const JwtStrategy = require('passport-http').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt;
const users = require('../models/users');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const secretOrKey = 'secret';

/**
 * Compare encrypted password to users password
 * @function
 * @param {array<object>} user - The user object that contains the encrypted password
 * @param {string} password - The inputted password to compare against
 * @returns {boolean} - True if password and encrypted password are correct, else false
 */
//compare encyrpted password to password
const verifyPassword = async function (user, password) {
  let verified = await bcrypt.compare(password, user.password);
  return verified;
}

/**
 * checks the inputted username and password against the the stored user credentials and generates a jwt token
 * @function
 * @param {array<object>} username - The inputted username 
 * @param {array<object>} username - The inputted password
 * @param {function} done - A function to call after trying to authenticate
 * @returns {string} - A jwt token for a successful auhthentication
 */
//check username and password 
const checkUserAndPass = async (username, password, done) => {
  let result;
  try {
    //try to get username
    result = await users.findByUsername(username);
  } 
  catch (error) {
    //error if username not found
    console.error(`Error during authentication for user ${username}`);
    return done(error);
  }

  // if user found
  if (result.length) {
    //check username and password
    const user = result[0];
    const correctPass = await verifyPassword(user, password);

    //if correct get jwt
    if (user.username === username && correctPass) {

      //get payload of user id and username
      const payload = {
        sub: user.userID,
        username: user.username
      };

      //submit payload and key 
      const token = jwt.sign(payload, secretOrKey, { expiresIn: '1h' });

      console.log(`Successfully authenticated user ${username}`);
      return done(null, token);
    } 
    //incorrect
    else {
      console.log(`Password incorrect for user ${username}`);
    }
  } 
  //user not found
  else {
    console.log(`No user found with username ${username}`);
  }
  //return false 
  return done(null, false);
};

//create the basicAuthenticate strategy and export for use elsewhere
const strategy = new BasicStrategy(checkUserAndPass);
module.exports = strategy;
