const router = require('express').Router();
const AWS = require('aws-sdk');
const uuid4 = require('uuid4');
const multer = require('multer');
const auddio = require('../auddio/auddio');
const constants = require('../constants/constants');

const store = multer.memoryStorage();
const upload = multer({ storage: store });

const constants = require('../constants/constants');

router.post('/', upload.single('audiofile'), (req, res) => {
    console.log(req.file);
    if (req.file.size > 2 * 1000000) {
        return res.json({ success: false, message: 'Filesize must be under 2MB, received ' + req.file.size / 1000000 + 'MB' });
    }

    const fileFormat = req.file.mimetype.split('/')[1].trim();
    const fileName = req.file.fieldname + uuid() + '.' + fileFormat;

    if (fileFormat !== 'mp3' || fileFormat !== 'ogg') {
        return res.json({ success: false, message: 'Only .mp3 and .ogg filetypes supported' });
    }

    res.json({ success: true, message: { format: fileFormat, name: fileName } });

    // let objectParams = { Bucket: constants.BUCKET_NAME, Key: fileName, Body: req.file.buffer, ContentType: req.file.mimetype };
    // try {
    //     let uploadResult = await new AWS.S3({ apiVersion: constants.API_VERSION }).putObject(objectParams).promise();
    //     let filePath = constants.BUCKET_URL + fileName;
    //     // let filePath = constants.BUCKET_URL + 'lastchristmas.mp3';
    //     console.log('Uploaded data to ' + filePath); // for instant S3 access checking
    //     let humResults = await auddio.getHummingResults(filePath);
    //     let token = await auddio.getNewSpotifyToken();
    //     if (humResults.result) {
    //         for (let resultItem of humResults.result.list) {
    //             try {
    //                 let resultObj = await auddio.getSpotifyResults(resultItem.artist, resultItem.title, token);
    //                 resultItem.spotifyResult = resultObj;
    //             } catch (error) {
    //                 resultItem.spotifyResult = false;
    //             }
    //         }
    //         res.status(200).json({ success: true, message: humResults.result.list });
    //     } else {
    //         res.status(200).json({ success: true, message: [] });
    //     }
    // } catch (error) {
    //     res.status(200).json({ success: false, message: error.message });
    // }
});

module.exports = router;
