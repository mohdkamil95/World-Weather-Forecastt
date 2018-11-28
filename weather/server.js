const express = require ('express');
const server = express();
const hbs = require('hbs');
const axios = require ('axios');
const bodyParser =require('body-parser');
const filemgr =require('./filemgr');

const port = process.env.PORT || 3000;

server.use(bodyParser.urlencoded({extended: true}));
server.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

var weatherdata;

hbs.registerHelper('list', (items, options) => {
  items = weatherdata;
  //console.log(items);
  var out = "<tr> <th>Address</th> <th>Summary</th> <th>Temp</th> </tr>";
  const length = items.length;
  for(var i=0; i<length; i++) {
    out = out + options.fn(items[i]);
    console.log(out);
  }
  //console.log(out);
  return out;
});

// hbs.registerHelper('list', (items, options) => {
//   items = weatherdata;
//   var out = "<tr><th>Address</th> <th>Summary</th> <th>Temp</th></tr>";
//   const length = items.length;
//   console.log(length);
//   return out;
// });

server.get('/', (req,res) => {
  res.render('Newmain.hbs');
});

server.get('/Newmain', (req,res) => {
  res.render('Newmain.hbs');
});

server.post('/form',(req,res)=> {
  res.render('form.hbs');
});

server.get('/results',(req,res)=> {
  res.render('results.hbs');
});

server.get('/about',(req,res)=> {
  res.render('about.hbs');
});


server.get('/historical',(req,res)=> {
  filemgr.getAllData().then((result) => {
    weatherdata = result;
    res.render('historical.hbs');
  }).catch((errorMessage) => {
    console.log(errorMessage);
  });
});

server.post('/delete', (req,res) => {
  filemgr.deleteAll().then((result) => {
    weatherdata = result;
    res.render('historical.hbs');
  }).catch((errorMessage) => {
    console.log(errorMessage);
  });
});


server.post('/getweather', (req, res) => {
  const addr = req.body.address;


  //res.render('main.hbs',{
    //title: 'Hola amigo',
  //message: 'welcome to my house',});
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
    const tempString = `${temperature} Celsius`;

    const weatherresult = {
      address: addr,
      summary: response.data.currently.summary,
      temperature: tempString,

    };

filemgr.saveData(weatherresult).then((result) => {
  res.render('results.hbs', weatherresult);
  }).catch((errorMessage) => {
    console.log(errorMessage);

  });

  })
  .catch((error)  => {
    console.log(error.code);
  });

});

server.get('/form', (req, res) => {
  res.render('form.hbs');
    //currentdate: new Date().toDateString(),
  });

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
