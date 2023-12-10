const addBlogForm = document.getElementById('addBlogForm')
addBlogForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const authour = document.getElementById('author').value;
    const description = document.getElementById('description').value;
    
    const response = await fetch('/blogs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, authour, description, content}),
    });
    if (response.ok) {
      alert('Blog added successfully!');
      window.location.href = '/';  
    } else {
      alert('Error adding blog. Please try again.');
    }
  });