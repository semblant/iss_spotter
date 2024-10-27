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
const fetchMyIP = callback => {
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


const fetchCoordsByIP = (ip, callback) => {

  needle.get(`http://ipwho.is/${ip}`, (error, response, body) => {
    // chceck for error from the request
    if (error) return callback(error, null);

    // check if "success" is true or not
    if (!body.success) {
      const message = `Success status was ${body.success}. Server message says: ${body.message} when fetching for IP ${body.ip}`;
      callback(Error(message), null);
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching coords for IP. Response ${body}`;
      callback(Error(msg), null);
      return;
    }

    const { latitude, longitude } = body;
    // No error
    callback(null, { latitude, longitude });
  });
};

module.exports = { fetchMyIP, fetchCoordsByIP };