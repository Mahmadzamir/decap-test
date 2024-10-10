const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Define the folder where your markdown files are located
const postsDir = path.join(__dirname, '_posts');

// Define the output JSON file
const outputFilePath = path.join(__dirname, 'posts.json');

// Load the existing posts.json if it exists
let existingPosts = [];
if (fs.existsSync(outputFilePath)) {
  const existingContent = fs.readFileSync(outputFilePath, 'utf-8');
  existingPosts = JSON.parse(existingContent);
}

// Create a map of existing posts by file path for quick lookup
const existingPostsMap = {};
existingPosts.forEach(post => {
  existingPostsMap[post.file] = post;
});

// Array to hold updated posts
const updatedPosts = [];

// Read the markdown files from the directory
fs.readdir(postsDir, (err, files) => {
  if (err) {
    console.error('Error reading posts directory:', err);
    return;
  }

  files.forEach(file => {
    if (path.extname(file) === '.md') {
      const filePath = path.join(postsDir, file);

      // Read the modification time of the file
      const stats = fs.statSync(filePath);
      const modifiedAt = stats.mtime;

      // If the post already exists and hasn't been modified, skip it
      if (existingPostsMap[filePath] && new Date(existingPostsMap[filePath].modifiedAt) >= modifiedAt) {
        updatedPosts.push(existingPostsMap[filePath]);
        return; // Skip this file as it hasn't been modified
      }

      // Read the contents of the markdown file
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data } = matter(fileContent); // Extract frontmatter

      // Push or update the post data
      updatedPosts.push({
        title: data.title || 'No title',
        file: data.file ? data.file[0] : 'No file',
        modifiedAt  // Store the file's modification time for sorting
      });
    }
  });

  // Sort the posts based on the 'modifiedAt' field in descending order
  updatedPosts.sort((a, b) => new Date(b.modifiedAt) - new Date(a.modifiedAt));

  // Write the updated posts array to the JSON file
  fs.writeFileSync(outputFilePath, JSON.stringify(updatedPosts, null, 2), 'utf-8');
  console.log('posts.json file updated successfully!');
});
