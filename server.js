const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const parser = bodyParser.urlencoded({ extended: true });

const AWS = require('aws-sdk');
const uuid4 = require('uuid4');
const multer = require('multer');
const store = multer.memoryStorage();
const upload = multer({ storage: store })

const logger = (req, res, next) => {
    let d = new Date();
    let options = { hour12: false };
    let date = d.toLocaleString('fi-FI', options);
    console.log(req.method + "@" + req.originalUrl + " / " + date);
    next();
}

const API_VERSION = '2006-03-01';
const BUCKET_NAME = 'pitchasong';
const BUCKET_URL = 'https://s3.eu-central-1.amazonaws.com/pitchasong/';

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
app.use(logger);

//Lisätään clientin POST-pyynnössä lähetämä äänitiedosto S3 Buckettiin
app.post('/bucket', upload.single('audiofile'), (req, res) => {
    console.log("req: ", req.file);
    
    let fileFormat = req.file.mimetype.split("/")[1].trim();
    let fileName = req.file.fieldname + uudi4() + "." + fileFormat;
    let objectParams = { Bucket: BUCKET_NAME, Key: fileName, Body: req.file.buffer, ContentType: req.file.mimetype };

    let uploadPromise = new AWS.S3({ apiVersion: API_VERSION }).putObject(objectParams).promise();
    uploadPromise
    .then(data => {
        console.log("Uploaded data to " + BUCKET_NAME + "/" + fileName);
    })
    .catch(error => console.error(error));
    res.send(BUCKET_URL + fileName);
});

// Tallentaa tekstikentän Postgresiin
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

//Lisää kovakoodatun tekstitiedoston S3 Buckettiin, kun frontista klikataan painiketta
app.post('/s3', parser, function (req, res) {
    let d = new Date();
    var options = { hour12: false };
    let date = d.toLocaleString('fi-FI', options);
    console.log("POST S3", date);
    console.log("req: ", req.body);
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

var port = process.env.PORT || 3001;
var server = app.listen(port, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Now listening at http://%s:%s", host, port)
});