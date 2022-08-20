const mongoose = require('mongoose');

const noteschema = new mongoose.Schema({
    id: String,
    data: [{
        note: String,
        time: String,
        date: String
    }]

});

let notemodel = new mongoose.model("notes", noteschema);

module.exports = notemodel;
