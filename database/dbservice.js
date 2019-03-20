const Pool = require('pg').Pool;
const conopts = {
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    database: process.env.RDS_DB_NAME
}

// Tallentaa tekstikentän Postgresiin
// app.get('/api', function(req, res) {
//     console.log('GET api');

//     let sqlInsert = 'INSERT INTO test (text) VALUES ($1)';
//     let sqlInsertAttr = [req.query.text];
//     pool.connect((err, client) => {
//         if (err) throw err;
//         client.query(sqlInsert, sqlInsertAttr, (err, data) => {
//             if (err) throw err;
//             client.release();
//             console.log('Inserted: ', req.query.text);
//         });
//     });

//     var response = { text: req.query.text };
//     res.json(response);
// });

const pool = new Pool(conopts);