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
    if (error) return callback(error.message, null); // callback returns error, and null IP

    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response ${body}`;
      callback(Error(msg), null);  // callback returns error, and null IP
      return;
    }

    // Else, succesful: print IP
    callback(null, body.ip);  // callback returns IP, and null error
  });
};

/**
 * Makes a single API request to retrieve the lat/lng for a given IPv4 address.
 *
 * @param {string} ip - The IP to look up coordinates for
 * @Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The coordinates as an object (null if error). Example: {latitude: x, longitude: y}
 */
const fetchCoordsByIP = (ip, callback) => {
  needle.get(`http://ipwho.is/${ip}`, (error, response, body) => {
    // chceck for error from the request
    if (error) return callback(error, null);  // callback returns error, and null coords

    // check if "success" is true or not
    if (!body.success) {
      const message = `Success status was ${body.success}. Server message says: ${body.message} when fetching for IP ${body.ip}`;
      callback(Error(message), null);  // callback returns error, and null coords
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching coords for IP. Response ${body}`;
      callback(Error(msg), null);  // callback returns error, and null coords
      return;
    }

    const { latitude, longitude } = body;
    // No error
    callback(null, { latitude, longitude });   // callback returns coords, and null error
  });
};


/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * @param {Object} coords - An object with keys `latitude` and `longitude`
 * @param {Function} callback - A callback (to pass back an error or the array of resulting data)
 *
 * @Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = (coords, callback) => {
  needle.get(`https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {
    // Check if error fetching URL
    if (error) return callback(error, null); // callback returns error, and null timestamps

    // Check if response status code is not 200
    if (response.statusCode !== 200) {
      const msg = `Status code ${response.statusCode} when fetching times for coordinates. Response ${body}`;
      callback(Error(msg), null);  // callback returns error, and null timestamps
      return;
    }

    // If no error, success
    const timesArray = body.response;
    callback(null, timesArray);  // callback returns timestamps, and null error
  });
};


/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * @param {Function} callback - A callback with an error or results.
 * @Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */
const nextISSTimesForMyLocation = callback => {
  // Call API to get IP address
  fetchMyIP((error, IP) => {
    // Check if error fetching IP
    if (error) return callback(error, null);

    // If no error, call API to get coords from IP
    fetchCoordsByIP(IP, (error, coords) => {
      // Check if error fetching coords
      if (error) return callback(error, null);

      // If no error, call API to get pass times from coords
      fetchISSFlyOverTimes(coords, (error, passTimes) => {
        // Check if error fetching pass times
        if (error) return callback(error, null);

        // If no error, return(?) pass times
        callback(null, passTimes);
      });
    });
  });
};


module.exports = { nextISSTimesForMyLocation };