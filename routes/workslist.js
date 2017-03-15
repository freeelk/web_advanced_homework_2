const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', function(req, res) {
    const WorksModel = mongoose.model('works');
    WorksModel.find().then(works => {
        res.json({works: works});
    });
});

module.exports = router;

