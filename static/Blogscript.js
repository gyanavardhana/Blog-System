document.getElementById('addBlogForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const authour = document.getElementById('author').value;
    const description = document.getElementById('description').value;

    // Send a request to the server to add the blog
    const response = await fetch('/blogs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, authour, description, content}),
    });

    // Handle the response (you can redirect to a new page or show a message)
    if (response.ok) {
      alert('Blog added successfully!');
      // Redirect to the home page or any other page as needed
      window.location.href = '/';  // Change the URL as needed
    } else {
      alert('Error adding blog. Please try again.');
    }
  });