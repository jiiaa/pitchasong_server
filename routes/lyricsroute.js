const express = require('express');
const router = require('express').Router();
// const app = express();
// const bodyParser = require('body-parser');

const apikey = process.env.API_KEY;

// const logger = (req, res, next) => {
//     let options = { hour12: false };
//     let date = d.toLocaleString('fi-FI', options);
//     console.log(req.method + '@' + req.originalUrl + ' / ' + date);
//     next();
// };

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(logger);

router.post('', (req, res) => {
    console.log("POST@lyrics, req: ", req.body);

    // return fetch(req.body.url, {
    //     method: 'GET',
    //     headers: {
    //         'Accept': 'application/json',
    //         'X-RapidAPI-Key': apikey
    //     }
    // }
    // .then(response => {
    //     console.log("Auddio: ", response);
    //     return response;
    // })
    // .catch(error => {
    //     console.error("Error: ", error);
    // })
    // )
    res.send("POST sent back");
});

module.exports = router;