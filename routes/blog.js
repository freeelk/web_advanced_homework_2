const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


router.get('/', function(req, res) {
    const BlogModel = mongoose.model('blog');
    BlogModel.find().then(blog => {
        let obj = {};
        Object.assign(obj, {blog: blog});
        res.render('pages/blog', obj);
    });
});

module.exports = router;
