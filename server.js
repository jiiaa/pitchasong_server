var express = require('express');
var app = express();
var cors = require('cors');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var parser = bodyParser.urlencoded({ extended: true });

var AWS = require('aws-sdk');
var uuid = require('uuid')
var s3 = new AWS.S3();

const Pool = require('pg').Pool;
const conopts = {
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    database: process.env.RDS_DB_NAME
}

const pool = new Pool(conopts);

app.use(cors());
app.use(express.static('public'));

app.get('/api', function(req, res) {
    console.log("GET api");

    let sqlInsert = 'INSERT INTO test (text) VALUES ($1)';
    let sqlInsertAttr = [req.query.text];
    pool.connect((err, client) => {
        if (err) throw err;
        client.query(sqlInsert, sqlInsertAttr,
        (err, data) => {
            if(err) throw err;
            client.release();
            console.log("Inserted: ", req.query.text);
        });
    });

    var response = {text: req.query.text};
    res.json(response);
});

app.get('/s3', function(req, res) {
    console.log("GET S3 read");

    // let bucketName = "s3.eu-central-1.amazonaws.com/pitchasong";
    // var params = {
    //     Bucket: bucketName, 
    //     Key: "AcceleratedLearning.txt"
    //    };
    //    s3.getObject(params, function(err, data) {
    //        console.log("getObject started...");
    //      if (err) {
    //          console.log("error: ", err, err.stack);
    //      } else {
    //          console.log("response data: ", data);
    //          res.send("data: ", data);
    //      };
    //     });

    let bucketName = "s3.eu-central-1.amazonaws.com/elasticbeanstalk-eu-central-1-046031456680";
    let keyName = 'hello_world.txt';
    var params = {Bucket: bucketName, Key: keyName, Body: 'Hello World!'};
    s3.putObject(params, function(err, data) {
        if (err) {
            console.log(err)
            res.send(err);
        } else {
            console.log("Successfully uploaded data to " + bucketName + "/" + keyName);
            res.send("Check your bucket...");
        }
    });
});

var port = process.env.PORT || 3001;
var server = app.listen(port, function() {
    var host = server.address().address
    var port = server.address().port
    console.log("Now listening at http://%s:%s", host, port )
});