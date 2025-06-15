const app = require('./app');

/**
 * starts the server and notify its online
 * @function
 * @param {number} port - The port number where the server listens
 * @returns {void}
 */
let port = process.env.PORT || 3001;
app.listen(port);
console.log(`API server running on port ${port}`)