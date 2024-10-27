const { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes } = require('./iss');

//fetchMyIP((error, IP) => {
//  if (error) {
//    console.log('Error fetch details: ', error);
//    return;
//  } else {
//    console.log('It worked! Returned IP: ', IP);
//  }
//})

//fetchCoordsByIP('24.66.255.164', (error, coords) => {
//  if (error) {
//    console.log('Error: ', error.message);
//  } else {
//    console.log('The coordinates are:', coords);
//  }
//});

//const ifError = (error, IP) => {
//  if (error) {
//    console.log('Error fetch details: ', error);
//    return;
//  } else {
//    console.log('It worked! Returned IP: ', IP);
//  }
//};


//fetchISSFlyOverTimes({ latitude: 51.0486151, longitude: -114.0708459 }, (error, times) => {
//  if (error) {
//    console.log('Error: ', error.message);
//  } else {
//    console.log('The times are:', times);
//  }
//});
