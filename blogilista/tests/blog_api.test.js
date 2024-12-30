const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../index');
const { test, after, before } = require('node:test');
const assert = require('node:assert');
const api = supertest(app);

test('blogs are returned as JSON and correct number of blogs', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
  console.log(response.body);

  assert.strictEqual(response.body.length, 11);
});

test('returned blogs should have id field', async () => {
  const response = await api.get('/api/blogs').expect(200);
  console.log(response.body.map((blog) => blog._id));

  response.body.forEach((blog) => {
    assert.ok(blog._id, 'Blog must have an id field');
  });
});
test('a valid blog can be added', async () => {
  const blogsAtStart = await api.get('/api/blogs');

  const newBlog = {
    title: 'New Title',
    author: 'New Author',
    url: 'newblog.com',
    likes: 10,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await api.get('/api/blogs');

  assert.strictEqual(blogsAtEnd.body.length, blogsAtStart.body.length + 1);

  const titles = blogsAtEnd.body.map((blog) => blog.title);
  assert(titles.includes('New Title'));
});

test.only('if likes is missing, it defaults to 0', async () => {
  const newBlog = {
    title: 'Blog without likes',
    author: 'Author without likes',
    url: 'http://nolikes.com',
  };

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  assert.strictEqual(response.body.likes, 0);
});

test('fails with status code 400 if title is missing', async () => {
  const newBlog = {
    author: 'Author with no title',
    url: 'http://notitle.com',
    likes: 5,
  };

  await api.post('/api/blogs').send(newBlog).expect(400);
});

test('fails with status code 400 if url is missing', async () => {
  const newBlog = {
    title: 'Blog without url',
    author: 'Author with no url',
    likes: 5,
  };

  await api.post('/api/blogs').send(newBlog).expect(400);
});

after(async () => {
  await mongoose.connection.close();
});
