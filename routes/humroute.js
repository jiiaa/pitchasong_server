const router = require('express').Router();
const AWS = require('aws-sdk');
const uuid4 = require('uuid4');
const multer = require('multer');
const auddio = require('../auddio/auddio');
const constants = require('../constants/constants');

const store = multer.memoryStorage();
const upload = multer({ storage: store });

const legit = 'https://s3.eu-central-1.amazonaws.com/pitchasong/lastchristmas.mp3';
const bullshit = 'https://s3.eu-central-1.amazonaws.com/pitchasong/audiofile6a3218d8-95bf-46e9-a28c-b20b83600630.ogg';

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
    let fileName = req.file.fieldname + uuid4() + '.' + fileFormat;
    let objectParams = { Bucket: constants.BUCKET_NAME, Key: fileName, Body: req.file.buffer, ContentType: req.file.mimetype };

    try {
        let uploadResult = await new AWS.S3({ apiVersion: constants.API_VERSION }).putObject(objectParams).promise();
        let filePath = constants.BUCKET_URL + '/lastchristmas.mp3';
        // let filePath = constants.BUCKET_URL + '/' + fileName;
        console.log('Uploaded data to ' + filePath);
        let humResults = await auddio.getHummingResults(filePath);
        res.status(200).json({ success: true, message: humResults });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

module.exports = router;
