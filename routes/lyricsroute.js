const express = require('express');
const router = require('express').Router();
const fetch = require('node-fetch');

const apikey = process.env.API_KEY;

router.post('', (req, res) => {
    console.log("POST@lyrics, req: ", req.body.url);
    const urli = 'https://api.audd.io/findLyrics/?q=How%20deep%20is%20your%20love';

    return fetch(req.body.url, {
        method: 'GET',
        headers: { 
            'Accept': 'application/json',
            'X-RapidAPI-Key': apikey
        }
    })
    .then(response => {
        console.log("Auddio: ", response);
        res.json(response);
        return;
    })
    .catch(error => {
        console.error("Error: ", error);
    })
    // res.send("POST sent back");
});

module.exports = router;