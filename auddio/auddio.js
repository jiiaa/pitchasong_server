const fetch = require('node-fetch');

const getHummingResults = async audio_url => {
    try {
        let result = await fetch('https://audd.p.rapidapi.com/recognizeWithOffset/?url=' + audio_url, {
            method: 'GET',
            headers: {
                Accept:'application/json',
                'X-RapidAPI-Key': ''
            }
        };
        if (!result.ok) {
            throw new Error('Audd.io humming query failed with statuscode ' + result.status);
        }
        let jsonRes = await result.json();
        return jsonRes;
    } catch (error) {
        throw error;
    }
};

module.exports = { getHummingResults };
