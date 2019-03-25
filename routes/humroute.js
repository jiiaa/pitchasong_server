const router = require('express').Router();
const AWS = require('aws-sdk');
const uuid4 = require('uuid4');
const multer = require('multer');
const auddio = require('../auddio/auddio');
const constants = require('../constants/constants');
const dbservice = require('../database/dbservice')

const store = multer.memoryStorage();
const upload = multer({ storage: store });

// const mockAnswerTrue = [
//     {
//         score: 68,
//         artist: 'Incubus',
//         title: 'Drive',
//         spotifyResult: {
//             performer: 'Incubus',
//             albumName: 'Make Yourself',
//             releaseDate: '2007-10-30',
//             trackUrl: 'https://open.spotify.com/track/7nnWIPM5hwE3DaUBkvOIpy',
//             imgUrl: 'https://i.scdn.co/image/a327aa78dd233419d51f5d9aee09f1b6e3b04d30'
//         }
//     },
//     {
//         score: 87,
//         artist: 'Adele',
//         title: 'Someone Like You',
//         spotifyResult: {
//             performer: 'Adele',
//             albumName: '21',
//             releaseDate: '2011-01-19',
//             trackUrl: 'https://open.spotify.com/track/4kflIGfjdZJW4ot2ioixTB',
//             imgUrl: 'https://i.scdn.co/image/7ace39dafcac6a253a026ffa473e0f14389fa1d8'
//         }
//     },
//     { score: 6, artist: 'notfound', title: 'notnotfound', spotifyResult: false }
// ];
// MOCK RESPONSE FOR DEVELOPMENT
// return res.status(200).json({ success: true, message: mockAnswerTrue });

// POST
// <request: hummed audiofile (parsed with multer)>
// <response: Audd.io API response or failure message>
router.post('/', upload.single('audiofile'), async (req, res) => {
    dbservice.addHumGet();
    let fileFormat = req.file.mimetype.split('/')[1].trim();
    let fileName = req.file.fieldname + '-' + uuid4() + '.' + fileFormat;
    let objectParams = { Bucket: constants.BUCKET_NAME, Key: fileName, Body: req.file.buffer, ContentType: req.file.mimetype };
    try {
        let uploadResult = await new AWS.S3({ apiVersion: constants.API_VERSION }).putObject(objectParams).promise();
        let filePath = constants.BUCKET_URL + fileName;
        // let filePath = constants.BUCKET_URL + 'lastchristmas.mp3';
        console.log('Uploaded data to ' + filePath); // for instant S3 access checking
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
            res.status(200).json({ success: true, message: humResults.result.list });
        } else {
            dbservice.addHumRes({status: false});
            res.status(200).json({ success: true, message: [] });
        }
    } catch (error) {
        res.status(200).json({ success: false, message: error.message });
    }
});

module.exports = router;