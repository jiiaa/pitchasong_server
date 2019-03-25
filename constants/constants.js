// require('dotenv').config({ path: '.env.development' });

const API_VERSION = '2006-03-01';
// const BUCKET_NAME = process.env.BUCKET_JA;
// const BUCKET_URL = process.env.BUCKET_URL_JA;
// const API_KEY = process.env.API_KEY;
// const SPOTIFY_AUTH = process.env.SPOTIFY_AUTH;

const BUCKET_NAME = 'file-bucket-00101';
const BUCKET_URL = 'https://s3.eu-central-1.amazonaws.com/file-bucket-00101/';
const API_KEY = '0dae49432cmsh41431873c82dec6p1f3a2ejsn91bbb48ba9c8';
const SPOTIFY_AUTH = 'Basic NTk5OWM0NzU2NTQ5NDA4Y2IyNzJmNjg0OWE4ZjBiNWY6OTViYTdhODU4YWQyNGFhN2FlYTZmOTAxMzNiNWYxNDg=';

module.exports = {
    API_VERSION,
    BUCKET_NAME,
    BUCKET_URL,
    API_KEY,
    SPOTIFY_AUTH
};
