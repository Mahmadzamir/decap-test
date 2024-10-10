const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Define the folder where your markdown files are located
const postsDir = path.join(__dirname, '_posts');

// Define the output JSON file
const outputFilePath = path.join(__dirname, 'posts.json');

// Read the markdown files from the directory
fs.readdir(postsDir, (err, files) => {
  if (err) {
    console.error('Error reading posts directory:', err);
    return;
  }

  const posts = [];

  files.forEach(file => {
    if (path.extname(file) === '.md') {
      const filePath = path.join(postsDir, file);

      // Read the contents of the markdown file
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data } = matter(fileContent); // Extract frontmatter

      // Get the file's creation time
      const stats = fs.statSync(filePath);
      const createdAt = stats.birthtime; // Get the creation time

      // Push the frontmatter data to the posts array
      posts.push({
        title: data.title || 'No title',
        file: data.file ? data.file[0] : 'No file',
        createdAt // Store the creation time
      });
    }
  });

  // Sort posts based on the creation time in descending order
  posts.sort((a, b) => b.createdAt - a.createdAt);

  // Write the posts array to a JSON file
  fs.writeFileSync(outputFilePath, JSON.stringify(posts, null, 2), 'utf-8');
  console.log('posts.json file created successfully!');
});
