const needle = require("needle");

/**
 * Makes a single API request to retrieve the user's IP address.
 *
 * @param {Function} callback - a callback (to pass back an error or the IP string)
 *
 * @Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  needle.get('https://api.ipify.org?format=json', (error, response, body) => {
    // error can be set if invalid domain, user offline, etc.
    if (error) return callback(error.message, null);

    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response ${body}`;
      callback(Error(msg), null);
      return;
    }

    // Else, succesful: print IP
    callback(null, body.ip);
  });
};

module.exports = { fetchMyIP };