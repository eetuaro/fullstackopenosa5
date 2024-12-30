import { useState } from 'react';
import blogService from '../services/blogs';

const BlogForm = ({ blogs, setBlogs, setSuccessMessage, setErrorMessage }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const newBlog = { title, author, url };
      const savedBlog = await blogService.create(newBlog);

      setBlogs(blogs.concat(savedBlog));
      setSuccessMessage(
        `A new blog "${savedBlog.title}" by ${savedBlog.author} added.`
      );
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);

      setTitle('');
      setAuthor('');
      setUrl('');
    } catch (exception) {
      setErrorMessage('Failed to create blog');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor='title'>title</label>
        <input
          id='title'
          type='text'
          value={title}
          name='Title'
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        <label htmlFor='author'>author</label>
        <input
          id='author'
          type='text'
          value={author}
          name='Author'
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        <label htmlFor='url'>url</label>
        <input
          id='url'
          type='text'
          value={url}
          name='Url'
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button type='submit'>create</button>
    </form>
  );
};

export default BlogForm;
