const fetch = require('node-fetch');
const constants = require('../constants/constants');

const getHummingResults = async audio_url => {
    try {
        let result = await fetch('https://audd.p.rapidapi.com/recognizeWithOffset/?url=' + audio_url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'X-RapidAPI-Key': constants.API_KEY
            }
        });
        if (!result.ok) {
            throw new Error('Audd.io error with message ' + result.message + ' and statuscode ' + result.status);
        }
        let jsonRes = await result.json();
        if (jsonRes.status === 'error') { // Check Audd.io error codes for more info
            if (jsonRes.error.error_code !== 100 && jsonRes.error.error_code !== 300) {
                throw new Error(jsonRes.error.error_message + ' ' + jsonRes.requested_params.url);
            }
        }
        return jsonRes;
    } catch (error) {
        throw error;
    }
};

const getRecordedResults = async rec_audio_url => {
    try {
        let result = await fetch('https://audd.p.rapidapi.com/recognize/?url=' + rec_audio_url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'X-RapidAPI-Key': constants.API_KEY
            }
        });
        if (!result.ok) {
            throw new Error('Audd.io error with message ' + result.message + ' and statuscode ' + result.status);
        }
        let jsonRes = await result.json();
        if (jsonRes.status === 'error') {
            throw new Error(jsonRes.error.error_message + ' ' + jsonRes.requested_params.url);
        }
        return jsonRes;
    } catch (error) {
        throw error;
    }
};

const getNewSpotifyToken = async () => {
    try {
        const grant_type = encodeURIComponent('grant_type');
        const value = encodeURIComponent('client_credentials');
        const formData = grant_type + '=' + value;
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: constants.SPOTIFY_AUTH
            },
            body: formData
        };

        let res = await fetch('https://accounts.spotify.com/api/token', options);
        if (res.status !== 200) {
            throw new Error('Fetching a new token failed ' + res);
        }
        let jsonRes = await res.json();
        if (!jsonRes.access_token || !jsonRes.token_type) {
            throw new Error('No access token or token type in response');
        }
        return jsonRes.token_type + ' ' + jsonRes.access_token;
    } catch (error) {
        return false;
    }
};

const getSpotifyResults = async (artist, title, token) => {
    let artistLowerCase = artist.toLowerCase();
    let titleLowerCase = title.toLowerCase();
    let searchURI = encodeURI(artistLowerCase + ' ' + titleLowerCase);
    let url = 'https://api.spotify.com/v1/search?q=' + searchURI + '&type=track&limit=1';
    try {
        let res = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: token || 'Bearer qwerty123456',
                Accept: 'application/json'
            }
        });
        if (!res.ok) throw new Error('Failed to fetch song/artist info');
        let jsonRes = await res.json();
        let item = jsonRes.tracks.items[0];
        let song = item.name;
        let performer = item.artists[0].name;
        if (song.toLowerCase() !== titleLowerCase || performer.toLowerCase() !== artistLowerCase) {
            throw new Error('Artist or song name does not match');
        }
        let albumName = item.album.name;
        let releaseDate = item.album.release_date;
        let trackUrl = item.external_urls.spotify;
        let albumImg = item.album.images.sort((img1, img2) => img1.width - img2.width)[0];
        let imgUrl = albumImg.url;
        return { performer, song, albumName, releaseDate, trackUrl, imgUrl };
    } catch (error) {
        throw error;
    }
};

module.exports = { getHummingResults, getSpotifyResults, getNewSpotifyToken, getRecordedResults };
