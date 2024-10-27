const needle = require('needle');


/**
 * Requests user's ip address from https://www.ipify.org/
 * @returns a Promise of request for ip data, returned as JSON string
 */
const fetchMyIP = () => {
  // return API call to fetch IP address
  return needle('get', 'https://api.ipify.org?format=json')
    .then((response) => {
      const body = response.body; // retrieve body value from the response object
      return body.ip;  // return ip from body object
    });
};

/**
 * Makes a request to ipwho.is using the provided IP address to get its geographical information (latitude/longitude)
 *
 * @param {string} ip - The IP to look up coordinates for
 * @returns a Promise of request for lat/lon
 */
const fetchCoordsByIP = (ip) => {

  // return API call to get coordinates based off IP address
  return needle('get',`http://ipwho.is/${ip}`)
    .then((response) => {
      const body = response.body; // retrieve body value from the response object
      const latitude = body.latitude; // retrieve latitude from body
      const longitude = body.longitude; // retrieve longitude from body
      return { latitude, longitude }; // return lat/lon as an object
    });
};

/**
 * Requests data from https://iss-flyover.herokuapp.com using provided lat/long data
 *
 * @param {Object} coords - object of lat/lon coordinates for geo data response from ipwho.is
 * @returns a Promise of request for fly over data, returned as JSON string
 */
const fetchISSFlyOverTimes = (coords) => {
  // Make API call to get fly over times based off coordinates
  return needle('get', `https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`)
    .then((response) => {
      const body = response.body; // retrive the body from response
      const flyoverTimes = body.response; // retrieve array of times from body --> changed name from response to flyoverTimes for clarity
      return flyoverTimes;
    });
};

/**
 * @returns a Promise for fly over data for users location
 */
const nextISSTimesForMyLocation = () => {
  return fetchMyIP()
    .then((ip) => fetchCoordsByIP(ip))
    .then((coords) => fetchISSFlyOverTimes(coords))
    .then((flyoverTimes) => {
      return flyoverTimes;
    });
};


module.exports = { nextISSTimesForMyLocation };