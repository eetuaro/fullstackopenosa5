import React, { useState } from 'react';
import blogService from '../services/blogs';

const Blog = ({ blog, setBlogs, blogs, user, handleLike }) => {
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [likes, setLikes] = useState(blog.likes);

  const toggleDetails = () => {
    setDetailsVisible(!detailsVisible);
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this blog?'
    );
    if (confirmed) {
      try {
        await blogService.remove(blog._id);
        setBlogs((prevBlogs) => prevBlogs.filter((b) => b._id !== blog._id));
      } catch (error) {
        console.error('Error when deleting blog:', error);
        alert('Failed to delete the blog.');
      }
    }
  };

  return (
    <div className='blog'>
      <div style={{ border: '1px solid', marginBottom: 5, padding: 10 }}>
        <div>
          {blog.title} {blog.author}
          <button onClick={toggleDetails}>
            {detailsVisible ? 'hide' : 'view'}
          </button>
        </div>
        {detailsVisible && (
          <div>
            <p>url: {blog.url}</p>
            <p>
              likes: {blog.likes} <button onClick={handleLike}>like</button>
            </p>
            <p>author: {blog.user.name}</p>
            {user && blog.user.username === user.username && (
              <button onClick={handleDelete}>delete</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
