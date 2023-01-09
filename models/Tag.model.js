const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tagsSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    }
   
});

const Tags = mongoose.model("Tags", tagsSchema); // create model Pizza

module.exports = Tags;