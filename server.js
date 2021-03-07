require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3000;

//body parser config
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(bodyParser.json());

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

//Post URL
const saveURL = require('./app.js').saveURL;
app.post("/api/shorturl/new", function(req, res, next) {
  
  // URL Validation
  const re = RegExp("https?://([^/]+)/?");
  if (re.test(req.body.url)) {
    var url = req.body.url.match(re)[1];
  } else {
    var url = "error";
  }

  dns.lookup(url, function(err, address) {
    // console.log(address);
    if (err) {
      res.json({ error: 'invalid url' });
    } else {
      next();
    }
  });
},function(req, res){
  saveURL(req.body.url, function (err, data){
    if (err) res.json({error: err});
    // console.log(data);
    res.json({ original_url : data['original_url'], short_url: data['short_url']})
  });
});

// Visit Stored pages
const getURL = require('./app.js').getURL;
app.get("/api/shorturl/:id", function (req, res) {
  getURL(req.params.id, function (err, data) {
    if (err || !data) {
      // console.log(err);
      res.json({error: "URL not found"});
    } else {
      let url = data["original_url"];
      res.redirect(url);
    }
  });
});


// Get data
const getData = require('./app.js').getData;
app.get("/api/getdata", function (req, res) {
  getData(function (err, data){
    if (err) res.json({error: err});
    // console.log(data);
    res.json(data)
  });
});

// delete data
const delData = require('./app.js').delData;
app.delete("/api/deletedata", function (req, res) {
  delData(function (err, data){
    if (err) res.json({error: err});
    // console.log(data);
    res.json(data)
  });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
