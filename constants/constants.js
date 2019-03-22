// require('dotenv').config({ path: '.env.development' });

const API_VERSION = '2006-03-01';
const BUCKET_NAME = process.env.BUCKET_JR;
const BUCKET_URL = process.env.BUCKET_URL_JR;
const API_KEY = process.env.API_KEY;
const SPOTIFY_AUTH = process.env.SPOTIFY_AUTH;

module.exports = {
    API_VERSION,
    BUCKET_NAME,
    BUCKET_URL,
    API_KEY,
    SPOTIFY_AUTH
};
