var express = require('express');
var router = express.Router();
var aws      =require('aws-sdk');
var fs = require('fs-extra');
const fileUpload = require('express-fileupload');

router.use(fileUpload({
  useTempFiles: true,
  tempFileDir: 'tmp'
}));


function deleteFileTemp(path) {
  try {
    fs.unlinkSync(path)
  } catch (err) {
    console.error("Error in deleting temp file " + path, err);
  }
}

bodyParser = require('body-parser');

const ID = process.env.ID;
const SECRET = process.env.SECRET;
const BUCKETNAME = process.env.BUCKETNAME;

const s3 = new aws.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET
});

router.post('/', function (req, res) {
  console.log(req.files);
  console.log(req.body);

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  let {filename, username, trip} = req.body;
  let dateUploaded = new Date().toLocaleString()
  const fileContent = fs.createReadStream(req.files.file.tempFilePath);


  console.log("My filename "+filename)
  console.log("My username "+username)
  console.log("My trip "+trip)
  console.log("My trip "+dateUploaded)
  console.log("tempFilePath:" + req.files.file.tempFilePath)
  console.log("EventId:" + req.body.eventId)
  console.log("mimetype: " + req.files.file.mimetype)

  var userOnly =  username.split("@");
  var keyPath = userOnly[0]+"/"+trip+"/"+req.files.file.name

  const params = {
    Bucket: BUCKETNAME,
    Key: keyPath,
    ContentType: req.files.file.mimetype,
    Body: fileContent
  };

  s3.upload(params, function (err, data) {
    if (err) {
      console.log("Error in uploading file", err);
      return res.status(500).send(`Can not upload the file. ${err}`)
  
    } else {
      deleteFileTemp(req.files.file.tempFilePath);
      console.log(`File uploaded successfully. ${data.Location}`);

      return res.status(200).send(`File uploaded successfully. ${data.Location}`)
    }
  });
});


router.use(bodyParser.json());

module.exports = router;