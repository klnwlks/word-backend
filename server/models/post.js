const mongoose = require('mongoose')

const postModel = new mongoose.Schema({
    content: {type: String, required: true},
    name: {type: String, required: true},
    created: {type: Date, default: Date.now, required: true},
    title: {type: String, required: false},
    replies: {type: Number, required: false, default: 0},
    parent: {type: mongoose.Schema.Types.ObjectId, ref: "Post", default: null},
    id: {type: Number, required: true},
    img: {
        data: Buffer,
        contentType: String,
    },
    filename: {type: String}
})

module.exports = mongoose.model("Post", postModel)
