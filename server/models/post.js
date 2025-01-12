const mongoose = require('mongoose')

const postModel = new mongoose.Schema({
    content: {type: String, required: true},
    name: {type: String, required: true},
    created: {type: Date, required: true},
    title: {type: String, required: false},
    replies: {type: Number, required: false},
    parent: {type: mongoose.Schema.Types.ObjectId, ref: "Post", default: null},
    id: {type: Number}
})

module.exports = mongoose.model("Post", postModel)
