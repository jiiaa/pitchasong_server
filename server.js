var express = require('express');
var app = express();
var cors = require('cors');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var parser = bodyParser.urlencoded({ extended: true });

var AWS = require('aws-sdk');
var uuid = require('uuid')

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

app.get('/api', function (req, res) {
    console.log("GET api");

    let sqlInsert = 'INSERT INTO test (text) VALUES ($1)';
    let sqlInsertAttr = [req.query.text];
    pool.connect((err, client) => {
        if (err) throw err;
        client.query(sqlInsert, sqlInsertAttr,
            (err, data) => {
                if (err) throw err;
                client.release();
                console.log("Inserted: ", req.query.text);
            });
    });

    var response = { text: req.query.text };
    res.json(response);
});

app.post('/s3', function (req, res) {
    let d = new Date();
    var options = { hour12: false };
    let date = d.toLocaleString('fi-FI', options);
    console.log("POST S3", date);
    consoloe.log("req: ", req);
    // var s3 = new AWS.S3();
    
    let bucketName = "pitchasong";
    let keyName = req.body.title + ".txt";
    let bodyText = req.body.text;
    let objectParams = { Bucket: bucketName, Key: keyName, Body: bodyText };
    console.log("Params: ", objectParams);
    var uploadPromise = new AWS.S3().putObject(objectParams).promise();
    uploadPromise.then(
        function (err, data) {
            if (err) {
                console.error(err);
                res.send("Error: ", err);
                return;
            } else {
                console.log("Successfully uploaded data to " + bucketName + "/" + keyName);
                res.send("ok/ ", data);
                return;
            };
        });
});

app.get('/s3', function (req, res) {
    let d = new Date();
    var options = { hour12: false };
    let date = d.toLocaleString('fi-FI', options);
    console.log("GET S3", date);

    let bucketName = "pitchasong";
    let keyName = req.query.title + ".txt";
    let objectParams = { Bucket: bucketName, Key: keyName };
    console.log("Params: ", objectParams);
    var downloadPromise = new AWS.S3().getObject(objectParams).promise();
    downloadPromise.then(
        function (err, data) {
            if (err) {
                console.error(err);
                res.send("Error: ", err);
            } else {
                console.log("Successfully downloaded data from " + bucketName + "/" + keyName);
                res.send("ok/ ", data);
            };
        });
});

var port = process.env.PORT || 3001;
var server = app.listen(port, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Now listening at http://%s:%s", host, port)
});