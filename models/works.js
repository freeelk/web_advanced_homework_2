'use strict'

const mongoose = require('mongoose');

let worksSchema = mongoose.Schema({
        "title": String,
        "skills": String,
        "link": String,
        "preview": String
    }, {collection: "works"}
);

mongoose.model('works', worksSchema);
