const router = require('express').Router();
const AWS = require('aws-sdk');
const uuid4 = require('uuid4');
const multer = require('multer');

const store = multer.memoryStorage();
const upload = multer({ storage: store });

const constants = require('../constants/constants');

// POST
// <request: hummed audiofile (parsed with multer)>
// <response: Audd.io API response or failure message>
router.get('/', (req, res) => {
    res.send('ok');
});

router.post('/', upload.single('audiofile'), (req, res) => {
    console.log('req: ', req.file);

    let fileFormat = req.file.mimetype.split('/')[1].trim();
    let fileName = req.file.fieldname + uuid4() + '.' + fileFormat;
    let objectParams = { Bucket: constants.BUCKET_NAME, Key: fileName, Body: req.file.buffer, ContentType: req.file.mimetype };

    let uploadPromise = new AWS.S3({ apiVersion: constants.API_VERSION }).putObject(objectParams).promise();
    uploadPromise
        .then(data => {
            console.log('Uploaded data to ' + constants.BUCKET_NAME + '/' + fileName);
        })
        .catch(error => console.error(error));
    res.send(constants.BUCKET_URL + fileName);
});

module.exports = router;
