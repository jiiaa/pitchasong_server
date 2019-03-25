const router = require('express').Router();
const dbservice = require('../database/dbservice')

router.get('/', (req, res) => {
    console.log("GET About");
    dbservice.getAbout(response => {
        console.log(response);
        res.json(response)
    })
});

module.exports = router;