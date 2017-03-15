const express = require('express');
const router = express.Router();
const formidable = require('formidable');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const config = require('../config.json');

const isAdmin = (req, res, next) => {
    if (req.session.isAdmin) {
        return next();
    }
    res.json({status: 'Авторизуйтесь!'});
};

router.post('/', isAdmin, function (req, res) {
    let form = new formidable.IncomingForm();
    form.uploadDir = config.upload;
    form.parse(req, function (err, fields, files) {
        if (err) {
            return res.json({status: 'Не удалось загрузить картинку'});
        }

        if (!(fields.title && fields.skills && fields.link)) {
            return res.json({status: 'Укажите данные!'});
        }
        const WorksModel = mongoose.model('works');
        let item = new WorksModel({title: fields.title, skills: fields.skills, link: fields.link, preview: files.photo.name});
        item.save().then(
            (i) => {
                fs
                    .rename(files.photo.path, path.join(config.upload, files.photo.name), function (err) {
                        if (err) {
                            fs.unlink(path.join(config.upload, files.photo.name));
                            fs.rename(files.photo.path, files.photo.name);
                        }
                        res.json({status: 'Проект успешно добавлен'});
                    });
            },
            (e) => {
                const error = Object
                    .keys(e.errors)
                    .map(key => e.errors[key].message)
                    .join(', ');
                res.json({status: 'При добавление записи произошла ошибка: ' + error});
            }
        );

    });
});

module.exports = router;