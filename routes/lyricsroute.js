const express = require('express');
const router = require('express').Router();
const app = express();

const apikey = process.env.API_KEY;

const logger = (req, res, next) => {
    let d = new Date();
    let options = { hour12: false };
    let date = d.toLocaleString('fi-FI', options);
    console.log(req.method + '@' + req.originalUrl + ' / ' + date);
    next();
};

app.use(logger);

router.post('/lyrics', (req, res) => {

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

    // })
    // )
    res.json(req.body.url);
});

module.exports = router;