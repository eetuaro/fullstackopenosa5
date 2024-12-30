const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../index');
const { test, after } = require('node:test');
const assert = require('node:assert');
const api = supertest(app);

test('a blog can be deleted', async () => {
  const blogsAtStart = await api.get('/api/blogs');
  const blogToDelete = blogsAtStart.body[0];

  await api.delete(`/api/blogs/${blogToDelete._id}`).expect(204);

  const blogsAtEnd = await api.get('/api/blogs');

  assert.strictEqual(blogsAtEnd.body.length, blogsAtStart.body.length - 1);

  const ids = blogsAtEnd.body.map((blog) => blog._id);
  assert.ok(
    !ids.includes(blogToDelete._id),
    'Poistettu blogi löytyy vielä tietokannasta'
  );
});

test('deleting a non-existent blog returns 404', async () => {
  const nonExistentId = '6465b2d6e7d3c4a68c3a5d71';
  await api.delete(`/api/blogs/${nonExistentId}`).expect(404);
});

test('deleting a blog with an invalid ID returns 400', async () => {
  const invalidId = '12345invalid';
  await api.delete(`/api/blogs/${invalidId}`).expect(400);
});

after(async () => {
  await mongoose.connection.close();
});
