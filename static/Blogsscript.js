const blog_form = document.getElementById("blog_form");
const search_input = document.getElementById("search_input");
const blog_list = document.getElementById("blog_list");
const add_blog = document.getElementById("add_blog");

// to get all blogs when page loads
get_all_blogs = async () => {
  const response = await fetch("/blogs");
  const blogs = await response.json();
  blog_list.innerHTML = "";
  if (blogs.length == 0) {
    blog_list.innerHTML = `
      <div class="noblogs">
              <h2>No Blogs Found</h2>
      </div>
      `;
  }else{
    blogs.forEach((blog) => {
      blog_list.innerHTML += `
        <div class="blog">
                <h2>${blog.title}</h2>
                <p>${blog.description}</p>
                <button onclick="readmore('${blog._id}')"class="btn">Read More</button>
        </div>
        `;
    });
  }
  
};

get_all_blogs();


// to get_blogs when searched
blog_form.addEventListener("click", (event) => {
  event.preventDefault();
  const search_term = search_input.value;
  if (search_term != "") {
    get_blogs(search_term);
  }else{
    get_all_blogs();
  }
});

//to add a new blog
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
              <p>${blog.description}</p>
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
  <header>
      <h1>${blog.title}</h1>
      <h2>Written by: ${blog.authour}</h2>
      <p class="created-at">Created at: ${blog.createdat}</p>
  </header>

  <article>
      <h3>Description</h3>
      <p class="description">${blog.description}</p>
      <h3>Content</h3>
      <p class="content">${blog.content}</p>
  </article>

  <div class="actions">
      <button onclick="editblog('${blog._id}')" class="btn">Edit Blog</button>
      <button onclick="deleteblog('${blog._id}')" class="btn btn-danger">Delete Blog</button>
  </div>

  <section class="comments">
      <h3>Comments</h3>
      <button onclick="addcomment('${blog._id}')" class="btn btn-primary">Add Comment</button>
      <div id="comment_list"></div>
  </section>
</div>

    `;
  getcomments(id);
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
        <input type="text" id="title" name="title" value="${blog.title}" required><br>

        <label for="authuor">Authour:</label>
        <input type="text" id="authour" name="authour" value="${blog.authour}" required><br>

        <label for="description">Description:</label>
        <textarea id="description" name="description" required>${blog.description}</textarea><br>

        <label for="content">Content:</label>
        <textarea id="content" name="content" required>${blog.content}</textarea><br>

        <button type="button" onclick="rewriteblog(
          '${blog._id}',
          document.getElementById('title').value,
          document.getElementById('authour').value,
          document.getElementById('description').value,
          document.getElementById('content').value
        )" class="btn">Submit</button>
      </form>
    </div>
  `;
};

// to rewrite a specific blog
rewriteblog = async (id, title, authour, description, content) => {
  await fetch(`/blogs/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: title,
      authour: authour,
      description: description,
      content: content,
    }),
  });
  readmore(id);
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
};

// to add a comment on to a blog
addcomment = async (id) => {
  const authour = prompt("Enter your name");
  const com = prompt("Enter your comment");
  if(authour != null && com != null){
    await fetch(`/comments/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        authour: authour,
        content: com,
        blog: id,
      }),
    });
    readmore(id);
  }
  
};

// function to get comments on a specific blog
getcomments = async (id) => {
  const response = await fetch(`/comments/${id}`);
  const comments = await response.json();
  const comment_list = document.getElementById("comment_list");
  comment_list.innerHTML = "";
  comments.forEach((comment) => {
    comment_list.innerHTML += `
      <div class="comment">
              <p>${comment.content} ...${comment.authour}...</p>
              <button onclick="deletecomment('${comment._id}')"class="btn">Delete</button>
      </div>
      `;
  });
};

// function to delete a specific comment
deletecomment = async (id) => {
  const response = await fetch(`/comments/details/${id}`);
  const comment = await response.json();
  const blog = comment.blog;
  await fetch(`/comments/${id}`, {
    method: "DELETE",
  });
  readmore(blog);
};
