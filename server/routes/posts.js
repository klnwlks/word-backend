const express = require("express");
const router = express.Router();
const Post = require('../models/post')
const Rank = require('../models/rank')

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Directory to save files
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Multer upload configuration
const upload = multer({ storage: storage });

// Directory for static files (if you need to serve uploaded files)
// TODO:
// - file handling
// - frontend obviously

async function updateModel(id) {
    const rank = await Rank.findOne()
    if (rank.posts.length > 100) {
        const last = await Rank.findOne({posts: -1})
        const res = await Rank.findOneAndUpdate( {
            $pop: {posts: last}
        })

        await Post.findOneAndDelete({id: last})

        console.log('removed post', res)
    }

    try {
        const post = await Post.findOneAndUpdate({
            $pull: {posts: id},
        })
        console.log('remove post from stack', post)
    } catch {pass} 

    const post = await Post.findOneAndUpdate({
        $push: {posts: id}
    })
    console.log('added post to top of stack', post)
}

// catalog
router.get('/', async (req, res) => {
    res.send('HELLO')
    try {
        const {postID} = req.param.id
        if (postID) {
            const post = await Post.findOne({id: postID})
            if (!post) return res.status(404)

            const replies = await Post.find({parent: postID}).sort({createdAt: -1})
            return res.json({post, replies})
        }

        rank = await Rank.findOne()
        const posts = await Post.find({parent: null})
        return res.json({posts, rank})

    } catch {
        return res.status(404)
    }
})

// make post
router.post('/', upload.single('file'), async (req, res) => {
    try {
        const {content, name, title} = req.body
        const post = new Post({
            content,
            date: Date.now(),
            parent: null,
            name: name || 'λ',
            title: title || null,
            id: await Post.findOne().sort({id: -1}).id + 1,
            img: req.file.buffer || null
        })

        updateModel(post.id)
        const spost = await post.save()
        res.status(201).json(spost)
    } catch(e) {
        console.log(e.message)
        return res.json(e)
    }
})

// reply to post
router.post('/post/:postID',  upload.single('file'), async (req, res) => {
    try {
        const {content, parent, name} = req.body
        const post = new Post({
            content,
            date: Date.now(),
            parent: parent,
            name: name || 'λ',
            id: await Post.findOne().sort({id: -1}).id + 1,
            img: req.file.buffer || null
        })

        const spost = await post.save()
        updateModel(post.id)
        res.status(201).json(spost)
    } catch (e) {
        console.log(e.message)
        return res.json(e)
    }
})

// update post replies
router.get('/post/:postID', async (req, res) => {
    try {
        const {parent} = req.param.id
        const replies = await Post.find({parent: parent}).sort({createdAt: -1})

        return res.json(replies)
    } catch (e) {
        console.log(e.message)
        return res.json(e)
    }
})

module.exports = router