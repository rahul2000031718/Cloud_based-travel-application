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

        let uploadStatus = false, message="Cannot fetch labels", response = "",
        labels={};
       
        let {filename} = req.body;
        console.log(filename)
    
        try {
                 var params = {
                     TableName: DYNAMOTABLE
                 };

                dynamodb.scan(params).promise()
                .then(function(result) {
                //    console.log(JSON.stringify(result))
                        result.Items.forEach((item) => {
                 
                        if (item.filename["S"] === filename){
                            labels = {
                                label0:item.label0["S"],
                                label1:item.label1["S"],
                                label2:item.label2["S"],
                                label3:item.label3["S"],
                                label4:item.label4["S"]
                            }
                        }
                    });
                       

                    uploadStatus= true
                    message = "Labels fetched"
                    res.status(200).json({
                         status:uploadStatus,
                         message: message,
                         response: labels
                         });
                    
                })
            } catch(e){
                console.log(e)
                uploadStatus = false
            }
    });

module.exports = router;