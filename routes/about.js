const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', function(req, res) {
    const SkillsModel = mongoose.model('skills');
    SkillsModel.find().then(skills => {
        let obj = {};
        Object.assign(obj, {skills: skills});
        res.render('pages/about', obj);
    });
});

module.exports = router;
