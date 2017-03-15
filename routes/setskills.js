const express = require('express');
const router = express.Router();
const config = require('../config.json');
const mongoose = require('mongoose');

router.post('/', (req, res) => {
    let data = req.body;
    data.forEach((item, index)=> {
        const SkillsModel = mongoose.model('skills');
        SkillsModel.findById(item.id).then(skills => {
            skills.skillsList.forEach((skill, index)=> {
                skills.skillsList[index].progress =  item.skills[skill.name];
            });

            skills.save().then(
                (i) => {return res.json({status: 'Данные изменены'});},
                (e) => {
                    const error = Object
                        .keys(e.errors)
                        .map(key => e.errors[key].message)
                        .join(', ');
                    res.json({status: 'При добавлении записи произошла ошибка: ' + error});
                }
            );

        });
    });
});

module.exports = router;


