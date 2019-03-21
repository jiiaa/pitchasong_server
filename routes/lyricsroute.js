const express = require('express');
const router = require('express').Router();
const fetch = require('node-fetch');

const apikey = process.env.API_KEY;

router.post('', (req, res) => {
    console.log("POST@lyrics, req: ", req.body.url);

    fetch(req.body.url, {
        method: 'GET',
        headers: { 
            'Accept': 'application/json',
            'X-RapidAPI-Key': apikey
        }
    })
    .then(response => {
        if (response.ok) {
            console.log("Auddio: ", response.json());
            return response.json();
        } else {
            throw new Error ("Failed to fetch russian vodka");
        }
    })
    .then (jsonRes => {
        console.log("status 200: ", jsonRes);
        res.status(200).json({ success: true, message: jsonRes });
    })
    .catch(error => {
        console.log("status 400: ", error);
        res.status(400).json({ success: false, message: error.message });
    })
});

module.exports = router;
