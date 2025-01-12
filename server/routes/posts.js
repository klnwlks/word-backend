const express = require('express');
const Post = require('./models/Post'); // Assuming the schema is saved in `models/Post.js`

const router = express.Router();

const MAX_POSTS = 100; // Maximum number of parent posts
const MAX_REPLIES = 200; // Maximum number of replies per post (set your preferred limit)

// Multer setup for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

async function createPost(body) {
    const count = await Post.countDocuments()
    const newPost = new Post({
        content: body.content,
        title: body.title,
        image: body.image ? {
            data: body.image.buffer,
            contentType: body.image.mimetype
        } : null,
        name: body.name,
        filename: body.image.fn,
        parent: Post.findOne({id: body.parent}) || null
    });

    if (body.parent && Post.findOne({id: body.parent}).replies < MAX_REPLIES) {
        await Post.findOneandUpdate(
            {id: body.parent},
            {lastUpdated: Date.now}
        )
    }

    await newPost.save()

    // delete oldest
    if (count > MAX_POSTS) {
        const excess = count - MAX_POSTS
        // find all posts that are beyond the limti
        const threadsToDelete = await Post.find().sort({ lastUpdated: 1}).limit(excess)

        // list of ids that belong to posts to be deleted
        const replies = await threadsToDelete.map(post => post.id)
        
        // delete replies first, them post
        await Post.deleteMany({parent: { $in: replies }})
        await Post.deleteMany({id: { $in: replies }})

        console.log('deleted all excess posts')
    }
}

// Route to get all posts
router.get('/', async (req, res) => {
  try {
    // find all parents, dont include image in return
    const posts = await Post.find({ parent: null}, {image: 0}).sort({ lastUpdated: -1})
    res.json(posts)
  } catch (err) {
    res.status(500).json({ error: 'Error fetching posts' });
  }
});


// Route to create a new post
router.post('/', upload.single('image'), async (req, res) => {
  try {
    // Create and save the new post
    createPost(req.body)
    res.status(200)
  } catch (err) {
    res.status(500).json({ error: 'Error creating post' });
  }
});

// Route to get a post and its replies
router.get('/post/:postID', async (req, res) => {
  try {
    const { postID } = req.params;

    const parentPost = await Post.findOne({id: postID}, {image: 0})
    const posts = await Post.find({parent: parentPost._id}, {image: 0})

    res.status(200).json({parentPost, posts})
  } catch (err) {
    res.status(500).json({ error: 'error finding post' })
  }
});

// Route to create a reply to a post
router.post('/post/:postID', upload.single('image'), async (req, res) => {
  try {
    const { postID } = req.params;
    createPost(res.body)
    res.status(200).json({error: 'reply success'})
  } catch (err) {
    res.status(500).json({error: 'cant reply'})
  }
});

module.exports = router;
