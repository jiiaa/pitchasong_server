const router = require('express').Router();

const constants = require('../constants/constants');

//Lisää kovakoodatun tekstitiedoston S3 Buckettiin, kun frontista klikataan painiketta
// router.post('/s3', parser, function(req, res) {
//     let d = new Date();
//     var options = { hour12: false };
//     let date = d.toLocaleString('fi-FI', options);
//     console.log('POST S3', date);
//     console.log('req: ', req.body);
//     // var s3 = new AWS.S3();

//     let bucketName = 'pitchasong';
//     let keyName = req.body.title + '.txt';
//     let bodyText = req.body.text;
//     let objectParams = { Bucket: bucketName, Key: keyName, Body: bodyText };
//     console.log('Params: ', objectParams);
//     var uploadPromise = new AWS.S3().putObject(objectParams).promise();
//     uploadPromise.then(function(err, data) {
//         if (err) {
//             console.error(err);
//             res.send('Error: ', err);
//             return;
//         } else {
//             console.log('Successfully uploaded data to ' + bucketName + '/' + keyName);
//             res.send('ok/ ', data);
//             return;
//         }
//     });
// });

module.exports = router;
