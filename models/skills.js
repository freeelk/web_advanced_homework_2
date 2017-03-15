'use strict'

const mongoose = require('mongoose');

let skillsSchema = mongoose.Schema({
        "group": String,
        "skillsList": [{
            "label": String,
            "name": String,
            "progress": Number
        }]
    }, {collection: "skills"}
);

mongoose.model("skills", skillsSchema);
