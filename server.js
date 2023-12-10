const express = require('express');
const cors = require('cors');
const {mongoose,Schema} = require('mongoose');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('./static'));


mongoose.connect('mongodb://127.0.0.1:27017/BlogSystem',{})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((err) => {
    console.log('Error connecting to MongoDB', err);
});


const blogschema = new Schema({
    title: String,
    authour: String,
    description: String,
    content: String,
    comments: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'}],
    createdat: { type: Date, default: Date.now }
});
const Blog = mongoose.model('Blog', blogschema);

const commentschema = new Schema({
    authour: String,
    content: String,
    blog:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'},
    createdat: { type: Date, default: Date.now }
});
const Comment = mongoose.model('Comment', commentschema);

app.get('/', (req, res) => {
    res.sendFile('/blogs.html', { root: __dirname + '/static' });
});



// search blogs
app.get('/blogs/search/:search_term', async (req, res) => {
    const search_term = req.params.search_term;
    const blogs = await Blog.find({ title: { $regex: search_term, $options: 'i' } });
    res.send(blogs);
});
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


app.get('/addblog', (req, res) => {
    res.sendFile('/blog.html', { root: __dirname + '/static' });
});
// Create a blog
app.post('/blogs', async (req, res) => {
    const blog = new Blog({
        title: req.body.title,
        authour: req.body.authour,
        description: req.body.description,
        content: req.body.content,
    });
    await blog.save();
    res.send(blog);
});



// Update a blog
app.patch('/blogs/:id', async (req, res) => {
    const blog = await Blog.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        authour: req.body.authour,
        description: req.body.description,
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

// Get a specific comment details
app.get('/comments/details/:id', async (req, res) => {
    const comment = await Comment.findById(req.params.id);
    res.send(comment);
});

// Create a comment on Specific blog
app.post('/comments/:id', async (req, res) => {
    const blogId = req.params.id;
    const comment = new Comment({
        authour: req.body.authour,
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