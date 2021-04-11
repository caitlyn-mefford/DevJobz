// index.js

const axios = require('axios');
const express = require('express');
const server = express();

const morgan = require('morgan');
server.use(morgan('dev'));

server.use(express.static('public'));

const bodyParser = require('body-parser');
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));

server.post('/job-search', async (req, res) => {
    try {
      const { description, fulltime } = req.body;
  
      const URL = `https://jobs.github.com/positions.json?${
        description ? `description=${ description }&` : ''
      }${
        fulltime ? 'full_time=true' : ''
      }`;
  
      const { data } = await axios.get(URL);
  
      res.send({ results: data });
    } catch (error) {
      res.send({ error });
    }
  });

server.get('/hello', (req, res, next) => {
    res.send(`
    <html>
    <head></head>
    <body>
      <h3>Hello!</h3>
    </body>
    </html>
    `)
  });
  
  server.listen(3000, () => {
    console.log('I am listening...');
  });


  const cowsay = require('cowsay');
const Quote = require('inspirational-quotes')

server.get('/cowspiration', (req, res) => {
  const { text, author } = Quote.getQuote();

  const cow = cowsay.say({
    text: `${ text }\n\n- ${ author }`,
    W: 80,
  });

  res.send({ cow });
});


server.get('/weather', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const URL = `https://api.openweathermap.org/data/2.5/onecall?lat=${ lat }&lon=${ lon }&appid=${ WEATHER_KEY }`;

    const { data } = await axios.get(URL);
    res.send({ results: data });
  } catch (error) {
    res.send({ error });
  }
});

require('dotenv').config(); 
const { PORT = 3000, WEATHER_KEY } = process.env;
server.listen(PORT, () => {
});

server.listen(3000, () => {
  console.log('I am listening...');
});