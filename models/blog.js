'use strict'

const mongoose = require('mongoose');

let blogSchema = mongoose.Schema({
        "title": String,
        "date": String,
        "text": String
    }, {collection: "blog"}
);

mongoose.model('blog', blogSchema);
