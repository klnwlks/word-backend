const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const postsRoute = require("./routes/posts");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

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
