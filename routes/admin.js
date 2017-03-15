const express = require('express');
const router = express.Router();
const config = require('../config.json');
const mongoose = require('mongoose');

const isAdmin = (req, res, next) => {
    if (req.session.isAdmin) {
        return next();
    }
    res.redirect('/');
};

router.get('/', isAdmin, function(req, res) {
    const SkillsModel = mongoose.model('skills');
    SkillsModel.find().then(skills => {
        let obj = {};
        Object.assign(obj, {skills: skills});
        res.render('pages/admin', obj);
    });
});

module.exports = router;
