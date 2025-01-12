const mongoose = require('mongoose')

// post catalogue
const rankModel = new mongoose.Schema({
    posts: [Number]
})

module.exports = mongoose.model('Rank', rankModel)