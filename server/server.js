const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const postsRoute = require("./routes/posts");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

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
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error(err));

// Routes
app.use("/", postsRoute);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
