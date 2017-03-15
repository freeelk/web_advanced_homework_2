'use strict'

const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
    let obj = {};
    res.render('pages/works', obj);
});

module.exports = router;
