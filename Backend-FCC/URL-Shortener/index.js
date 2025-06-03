require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const dns = require('dns');
const url = require('url');

app.use(bodyParser.urlencoded({extended : true}));

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

let dnsDB = [];

app.post('/api/shorturl' , function(req , res){
  const originalUrl = req.body.url;
  const hostname = new URL(originalUrl).hostname;
  console.log(hostname);
  dns.lookup(hostname , function(err , data){
    if(err) res.send({ error: 'invalid url' });
    else{
      console.log(data);
      let arr = String(data).split('.');
      let dnsNumber = '';
      for(let i = 0 ; i < arr.length ; i++){
        dnsNumber = dnsNumber + arr[i];
      }
      console.log(dnsNumber);
      dnsDB.push([dnsNumber , originalUrl]);
      console.log(dnsDB);
      res.json({
        "original_url": originalUrl,
        "short_url": dnsNumber
      });
    } 
  });
});

app.get('/api/shorturl/:num' , function(req , res){
  const id = req.params.num;
  const index = dnsDB.findIndex(entry => entry[0] === id);
  if(index !== -1){
    const url = dnsDB[index][1];
    res.redirect(url);
  } else {
    res.json({ error: "No short URL found for given input" });
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
