const Pool = require('pg').Pool;
const conopts = {
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    database: process.env.RDS_DB_NAME
};

const pool = new Pool(conopts);

function addHumGet(songData) {
    let sqlInsert = 'UPDATE stats SET humcount = humcount  + 1';
    // let sqlInsertAttr = [songData.link, songData.filename, songData.type];
    pool.connect((err, client) => {
        if (err) throw err;
        client.query(sqlInsert, (err, data) => {
            if (err) throw err;
            client.release();
            console.log('Humcount increased');
        });
    });
};

function addHumRes(status, response) {
    console.log("db/status: ", status);
    let scoreArray = [];
    response.forEach(element => {
        scoreArray.push(element);
    });
    scoreArray.sort(function(a, b){return b - a});
    let max = scoreArray[0];

    if (status === true) {
    let sqlUpdate = 'UPDATE stats SET humresultok = humresultok  + 1';
    let sqlInsert = 'INSERT INTO stats (humscore) VALUES ($1)';
    let sqlInsertAttr = [max];
    pool.connect((err, client) => {
        if (err) throw err;
        client.query(sqlUpdate, (err, data) => {
            if (err) throw err;
            console.log('Humresultok increased');
        });
        client.query(sqlInsert, sqlInsertAttr, (err, data) => {
            if (err) throw err;
            client.release();
            console.log("Score added");
        })
    });
    } else {
        let sqlInsert = 'UPDATE stats SET humresultnok = humresultnok  + 1';
        pool.connect((err, client) => {
            if (err) throw err;
            client.query(sqlInsert, (err, data) => {
                if (err) throw err;
                client.release();
                console.log('Humresultnok increased');
            });
        });
    }
};

function addLyricsGet(songData) {
    let sqlInsert = 'UPDATE stats SET lyricscount = lyricscount  + 1';
    pool.connect((err, client) => {
        if (err) throw err;
        client.query(sqlInsert, (err, data) => {
            if (err) throw err;
            client.release();
            console.log('Lyricscount increased');
        });
    });
};

function addLyricsRes(status) {
    console.log("db/status: ", status);
    if (status === true) {
    let sqlInsert = 'UPDATE stats SET lyricsresultok = lyricsresultok  + 1';
    pool.connect((err, client) => {
        if (err) throw err;
        client.query(sqlInsert, (err, data) => {
            if (err) throw err;
            client.release();
            console.log('Lyricsresultok increased');
        });
    });
    } else {
        let sqlInsert = 'UPDATE stats SET lyricsresultnok = lyricsresultnok  + 1';
        pool.connect((err, client) => {
            if (err) throw err;
            client.query(sqlInsert, (err, data) => {
                if (err) throw err;
                client.release();
                console.log('Lyricsresultnok increased');
            });
        });
    }
};

module.exports = { addHumGet, addHumRes, addLyricsGet, addLyricsRes };