const blog_form = document.getElementById("blog_form");
const search_input = document.getElementById("search_input");
const blog_list = document.getElementById("blog_list");
const add_blog = document.getElementById("add_blog");

blog_form.addEventListener("click", (event) => {
  event.preventDefault();
  const search_term = search_input.value;
  if (search_term != "") {
    get_blogs(search_term);
  }
});

add_blog.addEventListener("click", (event) => {
  event.preventDefault();
  window.location.href = "/addblog";
});

// to get blogs when searched
get_blogs = async (search_term) => {
  const response = await fetch(`/blogs/search/${search_term}`);
  const blogs = await response.json();
  blog_list.innerHTML = "";
  blogs.forEach((blog) => {
    blog_list.innerHTML += `
      <div class="blog">
              <h2>${blog.title}</h2>
              <p>${blog.content}</p>
              <button onclick="readmore('${blog._id}')"class="btn">Read More</button>
      </div>
      `;
  });
};

// to get a specific blog based on readmore

readmore = async (id) => {
  const response = await fetch(`/blogs/${id}`);
  const blog = await response.json();
  blog_list.innerHTML = "";
  blog_list.innerHTML += `
    <div class="specificblog">
            <h2>${blog.title}</h2>
            <p>${blog.content}</p>
            <button onclick="editblog('${blog._id}')"class="btn">Edit Blog</button>
            <button onclick="deleteblog('${blog._id}')"class="btn">Delete Blog</button>
            <div class="comments">
            <button onclick="addcomment('${blog._id}')"class="btn">Add Comment</button>
            <h3>Comments</h3>
            <div id="comment_list"></div>

            </div>
    </div>
    `;
    getcomments(id)
};

// to edit a specific blog
editblog = async (id) => {
  const response = await fetch(`/blogs/${id}`);
  const blog = await response.json();
  blog_list.innerHTML = "";
  blog_list.innerHTML += `
    <div class="editblog">
            <h2>Edit Blog</h2>
            <form id="editBlogForm">
    <label for="title">Title:</label>
    <input type="text" id="title" name="title" required><br>

    <label for="content">Content:</label>
    <textarea id="content" name="content" required></textarea><br>

    <label for="author">Author:</label>
    <input type="text" id="author" name="author" required><br>

    <label for="description">Description:</label>
    <textarea id="description" name="description" required></textarea><br>

    <button onclick="rewriteblog(
      '${blog._id}',
      document.getElementById('title').value,
      document.getElementById('content').value,
      document.getElementById('author').value,
      document.getElementById('description').value
  )" class="btn" type="submit">Submit</button>
  </form>
    </div>
    `;
};

// to rewrite a specific blog

rewriteblog = async (id, title, content, author, description) => {
  await fetch(`/blogs/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: title,
      content: content,
    }),
  });
  a,d = author,description
  const response = await fetch(`/blogs/${id}`);
  const blog = await response.json();
  console.log(blog)
  blog_list.innerHTML = "";
  blog_list.innerHTML += `
    <div class="specificblog">
            <h2>${blog.title}</h2>
            <p>${blog.content}</p>
            <button onclick="editblog('${blog._id}')"class="btn">Edit Blog</button>
            <button onclick="deleteblog('${blog._id}')"class="btn">Delete Blog</button>
            <div class="comments">
            <button onclick="addcomment('${blog._id}')"class="btn">Add Comment</button>
            <h3>Comments</h3>
            <div id="comment_list"></div>
    </div>
    `;
};


// to delete a specific blog and it's comments
deleteblog = async (id) => {
  const response = await fetch(`/blogs/${id}`);
  const blog = await response.json();
  const comments = blog.comments;
  comments.forEach(async (comment) => {
    await fetch(`/comments/${comment}`, {
      method: "DELETE",
    });
  });
  await fetch(`/blogs/${id}`, {
    method: "DELETE",
  });
  blog_list.innerHTML = "";
  blog_list.innerHTML += `
    <div class="deleteblog">
            <h2>Blog Deleted</h2>
            <button onclick="window.location.href = '/'"class="btn">Go Back</button>
    </div>
    `;
}

// to add a comment on to a blog
addcomment = async (id) => {
  const com = prompt("Enter your comment");
  const fetch_response = await fetch(`/comments/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: com,
      blog: id
    }),
  });
  readmore(id);
}

getcomments = async (id) => {
  const response = await fetch(`/comments/${id}`);
  const comments = await response.json();
  const comment_list = document.getElementById("comment_list");
  comment_list.innerHTML = "";
  comments.forEach((comment) => {
    comment_list.innerHTML += `
      <div class="comment">
              <p>${comment.content}</p>
              <button onclick="deletecomment('${comment._id}')"class="btn">Delete Comment</button>
      </div>
      `;
  });
}

deletecomment = async (id) => {
  const response = await fetch(`/comments/details/${id}`);
  const comment = await response.json();
  const blog = comment.blog;
  await fetch(`/comments/${id}`, {
    method: "DELETE",
  });
  readmore(blog);
}