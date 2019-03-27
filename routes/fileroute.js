const router = require('express').Router();
const AWS = require('aws-sdk');
const uuid4 = require('uuid4');
const multer = require('multer');
const auddio = require('../auddio/auddio');
const constants = require('../constants/constants');
const dbservice = require('../database/dbservice');

const store = multer.memoryStorage();
const upload = multer({ storage: store });

router.post('/', upload.single('audiofile'), async (req, res) => {
    // First check, filesize too big
    if (req.file.size > 1.5 * 1000000) {
        return res.json({ success: false, message: 'Filesize must be under 1.5MB, received ' + (req.file.size / 1000000).toFixed(2) + 'MB' });
    }

    const fileFormat = req.file.mimetype.split('/')[1].trim();
    const fileName = req.file.fieldname + '-' + uuid4() + '.' + fileFormat;

    // Second check, given filetype not supported
    if (fileFormat !== 'mp3' && fileFormat !== 'ogg') {
        return res.json({ success: false, message: 'Only .mp3 and .ogg filetypes supported' });
    }

    // Add 1 to File upload counter in database
    try {
        dbservice.addFileGet();
    } catch (error) {
        console.log('Error@addFileGet: ', error);
    }

    // S3 bucket parameters
    let objectParams = { Bucket: constants.BUCKET_NAME, Key: fileName, Body: req.file.buffer, ContentType: req.file.mimetype };

    // Upload to S3 bucket, fetch Auddio-API results and possible Spotify results
    try {
        let uploadResult = await new AWS.S3({ apiVersion: constants.API_VERSION }).putObject(objectParams).promise();
        let filePath = constants.BUCKET_URL + fileName;
        let recResults = await auddio.getRecordedResults(filePath);
        let token = await auddio.getNewSpotifyToken();
        if (recResults.result) {
            try {
                let resultObj = await auddio.getSpotifyResults(recResults.result.artist, recResults.result.title, token);
                recResults.result.spotifyResult = resultObj;
            } catch (error) {
                recResults.result.spotifyResult = false;
            }
            try {
                dbservice.addFileRes({ status: true });
            } catch (error) {
                console.log('Error@addFileRes: ', error);
            }
            res.status(200).json({ success: true, message: recResults.result });
        } else {
            dbservice.addFileRes({ status: false });
            res.status(200).json({ success: true, message: { artist: false } });
        }
    } catch (error) {
        res.status(200).json({ success: false, message: error.message });
    }
});

module.exports = router;
