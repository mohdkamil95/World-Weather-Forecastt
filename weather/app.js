const yargs = require('yargs');
const axios = require('axios');

const argv = yargs
.options('address')
.argv;

const addr = argv.address;

const locationReq = `https://maps.googleapis.com/maps/api/geocode/json?address=${addr}&key=AIzaSyCGCxQf4yOMG9yCsqQ9CzHKjUcs14fqDY4`;


axios.get(locationReq).then((response) => {
  console.log(response.data.results[0].formatted_address);
  //console.log('lat =',response.data.results[0].geometry.location.lat);
  const lat =response.data.results[0].geometry.location.lat;
  const lng =response.data.results[0].geometry.location.lng;
  const weatherReq = `https://api.darksky.net/forecast/3212c4fbdaa96a2aa80206cd67ee6ec1/${lat},${lng}`;
  return axios.get(weatherReq);
}).then((response) => {
  console.log(response.data.currently.summary);
  const temp = (response.data.currently.temperature - 32) * 0.5556;
  const temperature = temp.toFixed(2);
  console.log(`${temp} Celsius`);

})
.catch((error)  => {
  console.log(error.code);
});
