const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
    let obj = {title: "Главная страница"};
    res.render('pages/index', obj);
});


module.exports = router;
