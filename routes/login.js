/**
 * A route for logging in and fetching a jwt token
 * @module routes/login.js
 * @author Liam Trodden
 * @see ../controllers/auth
 */

const Router = require('koa-router');
const auth  = require('../controllers/auth');

const router = new Router({ prefix: '/api/v1/login' });
router.get('/', auth, getToken);

/**
 * get the jwt token of the authenticated user
 * If the user isn't found then status code 404
 * else return token and 200 status 
 * @function
 * @name getToken
 * @param {array<object>} ctx - object containing all data of the request
 * @returns {array<object>} - jwt token and any status codes 
 */
async function getToken(ctx) {
  if (!ctx.state.user) {
    ctx.status = 404;
    ctx.body = {message: "User not found"}
    return;
  }

  ctx.status = 200;
  ctx.body = {
    token: ctx.state.user
  }
}

module.exports = router;