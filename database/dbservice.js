const Pool = require('pg').Pool;
const conopts = {
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    database: process.env.RDS_DB_NAME
};

const pool = new Pool(conopts);

// Updates the counter of file uploads in the database
function addFileGet() {
    console.log("addFileGet@db");
    let sqlInsert = 'UPDATE stats SET filecount = filecount  + 1';
    pool.connect((err, client) => {
        if (err) throw err;
        client.query(sqlInsert, (err, data) => {
            if (err) throw err;
            client.release();
            console.log('Filecount increased');
        });
    });
};

// Updates the result counter of file uplaods (match found / match not found) in the database
function addFileRes(response) {
    console.log("addFileRes@db");
    console.log("db/status: ", response.status);

    if (response.status === true) {
        let sqlUpdate = 'UPDATE stats SET fileresultok = fileresultok  + 1';
        pool.connect((err, client) => {
            if (err) throw err;
            client.query(sqlUpdate, (err, data) => {
                if (err) throw err;
                client.release();
                console.log("Fileresultok increased");
            })
        });
    } else {
        let sqlInsert = 'UPDATE stats SET fileresultnok = fileresultnok  + 1';
        pool.connect((err, client) => {
            if (err) throw err;
            client.query(sqlInsert, (err, data) => {
                if (err) throw err;
                client.release();
                console.log('Fileresultnok increased');
            });
        });
    }
};

// Updates the counter of hum uploads in the database
function addHumGet() {
    console.log("addHumGet@db");
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

// Updates the result counter of hum tests (match found / match not found) in the database
function addHumRes(response) {
    console.log("addHumRes@db");
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
        let sqlInsert = 'INSERT INTO scores (score) VALUES ($1)';
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

// Updates the counter of lyrics tested in the database
function addLyricsGet() {
    console.log("addLyricsGet@db");
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

// Updates the result counter of lyrics tests (match found / match not found) in the database
function addLyricsRes(response) {
    console.log("addLyricsRes@db");
    if (response.status == true) {
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

// Retrieves all the statistids from the database for the About component in the client
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

module.exports = { addFileGet, addFileRes, addHumGet, addHumRes, addLyricsGet, addLyricsRes, getAbout };