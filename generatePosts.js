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

      // Push the frontmatter data to the posts array
      posts.push({
        title: data.title || 'No title',
        date: data.date || 'No date',
        file: data.file ? data.file[0] : 'No file'
      });
    }
  });

  // Write the posts array to a JSON file
  fs.writeFileSync(outputFilePath, JSON.stringify(posts, null, 2), 'utf-8');
  console.log('posts.json file created successfully!');
});
