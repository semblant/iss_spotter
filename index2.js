const printflyoverTimes = flyoverTimes => {
  flyoverTimes.forEach(time => {
    const dateTime = new Date(0);
    dateTime.setUTCSeconds(time.risetime);
    console.log(`Next pass at: ${dateTime} for ${time.duration} seconds!`);
  });
};

const { nextISSTimesForMyLocation} = require('./iss_promised');

nextISSTimesForMyLocation()
  .then((flyoverTimes) => {
    printflyoverTimes(flyoverTimes);
  })
  .catch((error) => {
    console.log('Error: ', error.message);
  });