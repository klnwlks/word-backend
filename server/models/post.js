const mongoose = require('mongoose')

const postModel = new mongoose.Schema({
    content: {type: String, required: true},
    name: {type: String, default: 'λ'},
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

const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const postSchema = new mongoose.Schema({
  id: { 
    type: Number, 
    unique: true 
  }, // Sequential ID
  content: { 
    type: String, 
    required: true 
  },
  name: { 
    type: String, 
    default: 'λ' 
  },
  created: { 
    type: Date, 
    default: Date.now 
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  title: { 
    type: String 
  }, // Optional field
  replies: { 
    type: Number, 
    default: 0 
  },
  filename: { 
    type: String, 
    required: false
  }, 
  image: { 
    required: false,
    data: { 
      type: Buffer, 
      required: true 
    }, // Binary data for the image
    contentType: { 
      type: String, 
      required: true 
    } // MIME type of the image (e.g., 'image/png', 'image/jpeg')
  },
  parent: { 
    type: Number, 
    default: null 
  } // Null for parent posts, ObjectId for replies
});

// Attach the auto-increment plugin to the schema
postSchema.plugin(AutoIncrement, { inc_field: 'id' });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
