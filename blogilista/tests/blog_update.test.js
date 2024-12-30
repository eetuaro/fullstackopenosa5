const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../index');
const { test, after } = require('node:test');
const assert = require('node:assert');
const Blog = require('../models/blog');
const api = supertest(app);

test('a blog can be updated with new likes', async () => {
  const blogsAtStart = await api.get('/api/blogs');
  const blogToUpdate = blogsAtStart.body[0];

  const updatedBlogData = {
    likes: blogToUpdate.likes + 1,
  };

  const response = await api
    .put(`/api/blogs/${blogToUpdate._id}`)
    .send(updatedBlogData)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  const updatedBlog = response.body;
  assert.strictEqual(updatedBlog.likes, updatedBlogData.likes);

  const blogInDb = await Blog.findById(blogToUpdate._id);
  assert.strictEqual(blogInDb.likes, updatedBlogData.likes);
});

after(async () => {
  await mongoose.connection.close();
});
