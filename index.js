const { nextISSTimesForMyLocation } = require('./iss');

const printPasstimes = passTimes => {
  passTimes.forEach(time => {
    const dateTime = new Date(0);
    dateTime.setUTCSeconds(time.risetime);
    console.log(`Next pass at: ${dateTime} for ${time.duration} seconds!`);
  });
};

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  // success, print out the deets!
  printPasstimes(passTimes);
});