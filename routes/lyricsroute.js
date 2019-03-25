const express = require('express');
const router = require('express').Router();
const fetch = require('node-fetch');
const dbservice = require('../database/dbservice');

const apikey = process.env.API_KEY;

router.post('', (req, res) => {
    console.log("POST@lyrics, req: ", req.body.url);
    dbservice.addLyricsGet();
    fetch(req.body.url, {
        method: 'GET',
        headers: { 
            'Accept': 'application/json',
            'X-RapidAPI-Key': apikey
        }
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error ("Failed to fetch Russian vodka");
        }
    })
    .then (jsonRes => {
        console.log("status 200");
        try {
            dbservice.addLyricsRes({status: true});
        } catch (error) {
            console.log("Error@addLyricsRes: ", error);
        }
        res.status(200).json({ success: true, message: jsonRes });
    })
    .catch(error => {
        console.log("status 400: ", error);
        dbservice.addLyricsRes({status: false});
        res.status(400).json({ success: false, message: error.message });
    })
});

module.exports = router;
