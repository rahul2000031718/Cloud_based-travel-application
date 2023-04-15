var express = require('express');
var router = express.Router();
var aws      =require('aws-sdk');

const ID = process.env.ID;
const SECRET = process.env.SECRET;
const DYNAMOTABLE = process.env.DYNAMOTABLE;


aws.config.update({region: "us-west-2",});
var dynamodb = new aws.DynamoDB({apiVersion: "2012-08-10",
                                accessKeyId: ID,
                                secretAccessKey: SECRET});


        router.post('/', function (req, res) {
            
            console.log(req.body)
            let {places,searchLabel,user} = req.body;
            places = places.toUpperCase()
            searchLabel = searchLabel.toUpperCase()

            var userArr =  user.split("@");
            user = userArr[0].toUpperCase()
            
            console.log(places)
            console.log(searchLabel)
            console.log(user)

            let uploadStatus = false, message="No pictures found", pictureURL = []
           
            try {
                     var params = {
                         TableName: DYNAMOTABLE
                     };
    
                    dynamodb.scan(params).promise()
                    .then(function(result) {
                    //    console.log(JSON.stringify(result))
                            result.Items.forEach((item) => {

console.log(item.filename["S"]+" "+item.user["S"]+" "+item.trip["S"]
+" "+item.label0["S"]+" "+item.label1["S"]+" "+item.label2["S"]+" "+item.label3["S"]+" "+item.label4["S"])
       
console.log(item.trip["S"].toUpperCase() === places && 
item.user["S"].toUpperCase() === user &&
(item.label0["S"].toUpperCase() === searchLabel
|| item.label1["S"].toUpperCase() === searchLabel
|| item.label2["S"].toUpperCase() === searchLabel
|| item.label3["S"].toUpperCase() === searchLabel
|| item.label4["S"].toUpperCase() === searchLabel))

    if (item.trip["S"].toUpperCase() === places && 
            item.user["S"].toUpperCase() === user &&
                (item.label0["S"].toUpperCase() === searchLabel
                || item.label1["S"].toUpperCase() === searchLabel
                || item.label2["S"].toUpperCase() === searchLabel
                || item.label3["S"].toUpperCase() === searchLabel
                || item.label4["S"].toUpperCase() === searchLabel)){
                                
                                console.log("---found---")
                                var fullPictureURL = item.user["S"]+"/"+item.trip["S"]+"/"+item.filename["S"]
                                pictureURL.push(fullPictureURL)
                                
                            }
                        });
                           
    
                        uploadStatus= true
                        message = "File details obtained"
                        res.status(200).json({
                             status:uploadStatus,
                             message: message,
                             response: pictureURL
                             });                    
                    })
                } catch(e){
                    console.log(e)
                    uploadStatus = false
                }
            })

module.exports = router;