const fetch = require('node-fetch');

const getHummingResults = async audio_url => {
    try {
        let result = await fetch('https://api.audd.io/recognizeWithOffset/?url=' + audio_url);
        if (!result.ok) {
            throw new Error('Audd.io humming query failed with statuscode ' + result.status);
        }
        let jsonRes = await result.json();
        return jsonRes;
    } catch (error) {
        return error.message;
    }
};

module.exports = { getHummingResults };
