require('dotenv').config();
const express = require('express')
const aws = require('aws-sdk');
const fs = require('fs');
var path = require('path');
var uploadPicture = require('./routes/uploadPicture')
var getLabels = require('./routes/getLabels')
var searchPicture = require('./routes/searchPicture')

const cors = require('cors');

const app = express();
app.use(express.json());

const reactAppPath = path.join(__dirname, '/travel-o-cloud-frontend/build');
app.use(express.static(reactAppPath));
app.set('views', path.join(__dirname, 'views'));

const serveReact = (req, res) => {
  res.sendFile(path.join(reactAppPath, 'index.html'));
}

app.get('/uploadPicture', serveReact);
app.get('/getLabels', serveReact);
app.get('/searchPicture', serveReact);
app.get('/*', serveReact);

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

 //Allow Access Control
/*app.use(function (req, res, next) {
  var allowedOrigins = [
    'travelocloud',
    'travel-o-cloud.us-west-2.elasticbeanstalk',
    'localhost'
  ];
    var origin = req.headers.origin;
    allowedOrigins.forEach(o => {
      if (origin.includes(o)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
      }
    })
    //res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Origin,Accept');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});*/

  app.use(cors({ origin: '*'}));
  app.use('/uploadPicture', uploadPicture);
  app.use('/getLabels', getLabels);
  app.use('/searchPicture', searchPicture);
 

const PORT = process.env.PORT || 8080;
app.listen(PORT, console.log(`Server started on port ${PORT}`));

module.exports = app;
