const Pool = require('pg').Pool;
const conopts = {
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    database: process.env.RDS_DB_NAME
};

const pool = new Pool(conopts);

function addHumGet() {
    console.log("addHumGet");
    let sqlInsert = 'UPDATE stats SET humcount = humcount  + 1';
    pool.connect((err, client) => {
        if (err) throw err;
        client.query(sqlInsert, (err, data) => {
            if (err) throw err;
            client.release();
            console.log('Humcount increased');
        });
    });
};

function addHumRes(response) {
    console.log("addHumRes");
    console.log("db/status: ", response.status);

    if (response.status === true) {
        let scoreArray = [];
        response.response.forEach(element => {
            scoreArray.push(element.score);
        });
        scoreArray.sort(function (a, b) { return b - a });
        console.log("scoreArray: ", scoreArray);
        let max = scoreArray[0];
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

function addLyricsGet() {
    console.log("addLyricsGet");
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

function addLyricsRes(response) {
    console.log("addLyricsRes");
    console.log("db/status: ", response.status.status);
    if (response.status.status == true) {
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

function getAbout(callback) {
    console.log("getAbout@db")
    let sqlFind = 'SELECT * FROM stats';
    pool.connect((err, client) => {
        if (err) throw err;
        client.query(sqlFind, (err, data) => {
            if (err) throw err;
            client.release();
            console.log("All data retrieved from db for About", data.rows);
            callback(data.rows);
        })
    })

}

module.exports = { addHumGet, addHumRes, addLyricsGet, addLyricsRes, getAbout };