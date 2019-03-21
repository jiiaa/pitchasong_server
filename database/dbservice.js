const Pool = require('pg').Pool;
const conopts = {
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    database: process.env.RDS_DB_NAME
};

function addSong(songData) {
    let sqlInsert = 'INSERT INTO songs (link, filename, type) VALUES ($1, $2, $3)';
    let sqlInsertAttr = [songData.link, songData.filename, songData.type];
    pool.connect((err, client) => {
        if (err) throw err;
        client.query(sqlInsert, sqlInsertAttr, (err, data) => {
            if (err) throw err;
            client.release();
            console.log('Inserted: ', data);
        });
    });
    var response = { res: "Song added to database" };
    res.json(response);
};

function deleteSong(songData) {
    let sqlDelete = 'DELETE FROM songs WHERE link = $1';
    let sqlDelAttr = [songData.link];
    pool.connect((err, client) => {
        if (err) throw err;
        client.query(sqlDelete, sqlDelAttr, (err, data) => {
            if (err) throw err;
            client.release();
            console.log('Song deleted', data);
        })
    })
    var response = { res: "Song deleted from database" };
    res.json(response)
};

const pool = new Pool(conopts);

module.exports = { addSong, deleteSong };