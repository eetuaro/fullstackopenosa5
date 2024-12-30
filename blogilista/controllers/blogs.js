const express = require('express');
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const blogsRouter = express.Router();

blogsRouter.get('/', async (request, response) => {
  try {
    const blogs = await Blog.find({}).populate('user', {
      username: 1,
      name: 1,
    });
    response.json(blogs);
  } catch (error) {
    response.status(500).send({ error: 'Something went wrong' });
  }
});

blogsRouter.post('/', async (request, response) => {
  const { title, url, likes } = request.body;
  const user = request.user;

  const blog = new Blog({
    title,
    url,
    likes: likes || 0,
    user: user._id,
  });

  try {
    const savedBlog = await blog.save();

    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    response.status(201).json(savedBlog);
  } catch (error) {
    response.status(400).json({ error: 'Virhe blogin lisäämisessä' });
  }
});

blogsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  const user = request.user;

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return response.status(404).json({ error: 'Blogia ei löydy' });
    }

    if (blog.user.toString() !== user._id.toString()) {
      return response
        .status(403)
        .json({ error: 'Ei oikeuksia poistaa tätä blogia' });
    }

    await Blog.findByIdAndDelete(id);
    response.status(204).end();
  } catch (error) {
    response.status(400).json({ error: 'Virhe poistettaessa blogia' });
  }
});

blogsRouter.put('/:id', async (request, response) => {
  const { id } = request.params;
  const blog = request.body;
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(id, blog, { new: true });
    if (updatedBlog) {
      response.json(updatedBlog);
    } else {
      response.status(404).json({ error: 'Blog not found' });
    }
  } catch (error) {
    response.status(400).json({ error: 'Invalid id format' });
  }
});

module.exports = blogsRouter;
