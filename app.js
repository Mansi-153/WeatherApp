const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

const apiKey = '8b49bb2b7356d6d5ace5fd788b2784bb';

app.use(express.static('public'));

const path = require('path');
const expressHandleBars = require('express-handlebars');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('views')); 

app.set("views", path.join(__dirname,"/views/"))
app.engine("hbs", expressHandleBars({
    extname: "hbs",
    defaultLayout: "mainLayout",
    layoutsDir: __dirname + "/views/layouts"
}));
app.set("view engine", "hbs");
router.get('/', function (req, res) {
  res.render('index', {weather: null});
});

router.post('/', function (req, res) {
  let city = req.body.city;
  let url = `http://api.weatherstack.com/current?access_key=${apiKey}&query=${city}`;
  
  request(url, function (err, response, body) {
    if(err){
      return res.render('index', {weather: 'Error, please try again'});
    }
    let weather = JSON.parse(body);
    if(weather.current == undefined){
      return res.render('index', {weather: 'Error, please try again'});
    }
    let weatherText = `It's ${weather.current.temperature} degrees ${weather.current.is_day === "yes" ? 'Day time' : 'Night time'} in ${weather.location.name}, ${weather.location.country}!`;
    console.log(weatherText);
    res.render('index', {weather: weatherText});
  });
});
router.get('/temp', function (req, res) {
  res.render('index', {weather: null});
});

router.post('/temp', function (req, res) {
  let city = req.body.city;
  let date = req.body.date;
  let url = `http://api.weatherstack.com/historical?access_key=${apiKey}&query=${city}&historical_date=${date}`;
  
  request(url, function (err, response, body) {
    if(err){
      console.log(err)
      return res.render('index', {weather: 'Error, please try again'});
    }
    let weather = JSON.parse(body);
    if(weather.current == undefined){
      console.log(err);
      return res.render('index', {weather: 'Error, please try again'});
    }
    let weatherText = `It's ${weather.current.temperature} degrees ${weather.current.is_day === "yes" ? 'Day time' : 'Night time'} in ${weather.location.name}, ${weather.location.country}!`;
    console.log(weatherText);
    res.render('index', {weather: weatherText});
  });
});

app.use('/', router);

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
