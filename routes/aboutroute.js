const router = require('express').Router();
const dbservice = require('../database/dbservice')

router.get('/', (req, res) => {
    dbservice.getAbout(response => {
        console.log(response);
        res.json(response)
    })
});

module.exports = router;