const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const isAdmin = (req, res, next) => {
    if (req.session.isAdmin) {
        return next();
    }
    res.json({status: 'Авторизуйтесь!'});
};

router.post('/', isAdmin, (req, res) => {
    if (!req.body.title || !req.body.date || !req.body.text) {
        return res.json({status: 'Укажите данные!'});
    }

    let item = new BlogModel({title: req.body.title, date: req.body.date, text: req.body.text});
    item.save().then(
        (i) => {return res.json({status: 'Запись успешно добавлена'});},
        (e) => {
            const error = Object
                .keys(e.errors)
                .map(key => e.errors[key].message)
                .join(', ');
            res.json({status: 'При добавление записи произошла ошибка: ' + error});
        }
    );
});

module.exports = router;