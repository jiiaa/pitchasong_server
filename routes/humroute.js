const router = require('express').Router();
const AWS = require('aws-sdk');
const uuid4 = require('uuid4');
const multer = require('multer');
const auddio = require('../auddio/auddio');
const constants = require('../constants/constants');
const dbservice = require('../database/dbservice');

const store = multer.memoryStorage();
const upload = multer({ storage: store });

// POST
// <request: hummed audiofile (parsed with multer)>
// <response: Audd.io API response or failure message>
router.post('/', upload.single('audiofile'), async (req, res) => {
    // Add 1 to Hum upload counter in database
    try {
        dbservice.addHumGet();
    } catch (error) {
        console.log('Error@addHumGet: ', error);
    }

    let fileFormat = req.file.mimetype.split('/')[1].trim();
    let fileName = req.file.fieldname + '-' + uuid4() + '.' + fileFormat;
    let objectParams = { Bucket: constants.BUCKET_NAME, Key: fileName, Body: req.file.buffer, ContentType: req.file.mimetype };
    try {
        let uploadResult = await new AWS.S3({ apiVersion: constants.API_VERSION }).putObject(objectParams).promise();
        let filePath = constants.BUCKET_URL + fileName;
        let humResults = await auddio.getHummingResults(filePath);
        let token = await auddio.getNewSpotifyToken();
        if (humResults.result) {
            for (let resultItem of humResults.result.list) {
                try {
                    let resultObj = await auddio.getSpotifyResults(resultItem.artist, resultItem.title, token);
                    resultItem.spotifyResult = resultObj;
                } catch (error) {
                    resultItem.spotifyResult = false;
                }
            }
            try {
                dbservice.addHumRes({status: true, response: humResults.result.list});
            } catch (error) {
                console.log("Error@addHumRes: ", error);
            }
            let objectParam = { Bucket: constants.BUCKET_NAME, Key: fileName};
            s3.deleteObject(objectParam, function(err, data) {
                if (err) console.log("File@Bucket delete error: ",err, err.stack);  // error
                else     console.log("File delete ok @Bucket");                 // deleted
            });
            res.status(200).json({ success: true, message: humResults.result.list });
        } else {
            dbservice.addHumRes({ status: false });
            res.status(200).json({ success: true, message: [] });
        }
    } catch (error) {
        res.status(200).json({ success: false, message: error.message });
    }
});

module.exports = router;
