const express = require('express');
const cors = require('cors');
const {mongoose,Schema} = require('mongoose');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

mongoose.connect('mongodb://127.0.0.1:27017/BlogSystem',{})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((err) => {
    console.log('Error connecting to MongoDB', err);
});


const blogschema = new Schema({
    title: String,
    content: String,
    comments: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'}],
});
const Blog = mongoose.model('Blog', blogschema);

const commentschema = new Schema({
    content: String,
    blog:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'},
});
const Comment = mongoose.model('Comment', commentschema);

// Get all blogs
app.get('/blogs', async (req, res) => {
    const blogs = await Blog.find();
    res.send(blogs);
});

// Get one Specific blog
app.get('/blogs/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    res.send(blog);
});

// Create a blog
app.post('/blogs', async (req, res) => {
    const blog = new Blog({
        title: req.body.title,
        content: req.body.content,
    });
    await blog.save();
    res.send(blog);
});

// Update a blog
app.patch('/blogs/:id', async (req, res) => {
    const blog = await Blog.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        content: req.body.content,
    });
    res.send(blog);
});

// Delete a blog
app.delete('/blogs/:id', async (req, res) => {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    res.send(blog);
});


// Get a specific blog comments
app.get('/comments/:id', async (req, res) => {
    const blogId = req.params.id;
    const comments = await Comment.find({ blog: blogId });
    res.send(comments);
});

// Create a comment on Specific blog
app.post('/comments/:id', async (req, res) => {
    const blogId = req.params.id;
    const comment = new Comment({
        content: req.body.content,
        blog: blogId,
    });

    await comment.save();

    await Blog.findByIdAndUpdate(blogId, { $push: { comments: comment._id } });

    res.send(comment);
});

// Delete a comment from a blog
app.delete('/comments/:id', async (req, res) => {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    await Blog.findByIdAndUpdate(comment.blog, { $pull: { comments: comment._id } });
    res.send(comment);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});