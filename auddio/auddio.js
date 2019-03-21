const fetch = require('node-fetch');
require('dotenv').config({ path: '.env.development' });

const getHummingResults = async audio_url => {
    try {
        let result = await fetch('https://audd.p.rapidapi.com/recognizeWithOffset/?url=' + audio_url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'X-RapidAPI-Key': process.env.AUDD_API_KEY
            }
        });
        if (!result.ok) {
            throw new Error('Audd.io error with message ' + result.message + ' and statuscode ' + result.status);
        }
        let jsonRes = await result.json();
        return jsonRes;
    } catch (error) {
        throw error;
    }
};

module.exports = { getHummingResults };
