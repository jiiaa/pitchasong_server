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

function addHumRes(status) {
    console.log("db/status: ", status);
    if (status === true) {
    let sqlInsert = 'UPDATE stats SET humresultok = humresultok  + 1';
    pool.connect((err, client) => {
        if (err) throw err;
        client.query(sqlInsert, (err, data) => {
            if (err) throw err;
            client.release();
            console.log('Humresultok increased');
        });
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
    let sqlInsert = 'UPDATE stats SET lyricscountok = lyricscountok  + 1';
    pool.connect((err, client) => {
        if (err) throw err;
        client.query(sqlInsert, (err, data) => {
            if (err) throw err;
            client.release();
            console.log('Lyricsresultok increased');
        });
    });
    } else {
        let sqlInsert = 'UPDATE stats SET lyricscountnok = lyricscountnok  + 1';
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