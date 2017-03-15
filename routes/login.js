const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const crypto = require('crypto');

router.post('/', (req, res) => {

    if (!req.body.login || !req.body.password) {
        return res.json({status: 'Укажите логин и пароль!'});
    }

    const Model = mongoose.model('user');
    const password = crypto.createHash('md5').update(req.body.password).digest('hex');

    Model.findOne({login: req.body.login, password: password}).then(item => {
        if (!item) {
            res.json({status: 'Логин и/или пароль введены неверно!'});
        } else {
            req.session.isAdmin = true;
            res.json({status: 'Авторизация успешна!'});
        }
    });
});

module.exports = router;
