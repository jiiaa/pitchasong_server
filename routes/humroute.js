const router = require('express').Router();
const AWS = require('aws-sdk');
const uuid4 = require('uuid4');
const multer = require('multer');
const auddio = require('../auddio/auddio');
const constants = require('../constants/constants');

const store = multer.memoryStorage();
const upload = multer({ storage: store });

const mockAnswerTrue = JSON.stringify({
    status: 'success',
    result: {
        underground: 'humming',
        humming: true,
        count: 2,
        list: [
            {
                score: 75,
                artist: 'Brown eyed soul',
                title: 'nothing better'
            },
            {
                score: 64,
                artist: 'Adele',
                title: 'Someone Like You'
            }
        ]
    }
});

const mockAnswerFalse = JSON.stringify({ status: 'success', result: null });

// POST
// <request: hummed audiofile (parsed with multer)>
// <response: Audd.io API response or failure message>
router.get('/', (req, res) => {
    res.status(200).json({ success: true, message: mockAnswerFalse });
    // auddio
    //     .getHummingResults(bullshit)
    //     .then(response => {
    //         console.log(response);
    //     })
    //     .catch(err => console.error(err));
    // res.end();
});

router.post('/', upload.single('audiofile'), async (req, res) => {
    console.log('req: ', req.file);

    let fileFormat = req.file.mimetype.split('/')[1].trim();
    let fileName = req.file.fieldname + '-' + uuid4() + '.' + fileFormat;
    let objectParams = { Bucket: constants.BUCKET_NAME, Key: fileName, Body: req.file.buffer, ContentType: req.file.mimetype };

    try {
        let uploadResult = await new AWS.S3({ apiVersion: constants.API_VERSION }).putObject(objectParams).promise();
        let filePath = constants.BUCKET_URL + fileName;
        console.log('Uploaded data to ' + filePath);
        let humResults = await auddio.getHummingResults(filePath);
        console.log(humResults);
        if (humResults.result) {
            res.status(200).json({ success: true, message: humResults.result.list });
        } else {
            res.status(200).json({ success: true, message: [] });
        }
    } catch (error) {
        res.status(200).json({ success: false, message: error.message });
    }
});

module.exports = router;