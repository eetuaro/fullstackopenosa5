import { render, screen } from '@testing-library/react';
import Blog from './Blog';
import userEvent from '@testing-library/user-event';
import { expect, vi } from 'vitest';
import * as blogService from '../services/blogs';

test('renders blog title', () => {
  const blog = {
    title: 'Test Blog Title',
    author: 'Test Author',
    likes: 0,
    user: { username: 'testuser', name: 'Test User' },
  };

  render(
    <Blog blog={blog} setBlogs={() => {}} user={{ username: 'testuser' }} />
  );

  const titleElement = screen.getByText(/Test Blog Title/);
  expect(titleElement).toBeInTheDocument();
});

test('renders blog details after clicking the View button', async () => {
  const blog = {
    title: 'Title',
    author: 'Test Author',
    url: 'urli',
    likes: 50,
    user: { username: 'testuser', name: 'Test User' },
  };

  render(
    <Blog blog={blog} setBlogs={() => {}} user={{ username: 'testuser' }} />
  );

  const user = userEvent.setup();
  const button = screen.getByText('view');
  await user.click(button);

  expect(screen.getByText(/url: urli/)).toBeInTheDocument();
  expect(screen.getByText(/likes: 50/)).toBeInTheDocument();
  expect(screen.getByText(/author: Test User/)).toBeInTheDocument();
});

// Mockataan blogService.update metodi (ei oletusexport)
vi.mock('../services/blogs', () => ({
  update: vi.fn(),
}));

test('calls handleLike twice when like button is clicked twice', async () => {
  const blog = {
    _id: '1',
    title: 'Test Blog Title',
    author: 'Test Author',
    likes: 0,
    user: { username: 'testuser', name: 'Test User' },
  };

  // Luodaan mock-funktio setBlogsille
  const setBlogs = vi.fn();

  render(
    <Blog blog={blog} setBlogs={setBlogs} user={{ username: 'testuser' }} />
  );

  const user = userEvent.setup();
  const viewButton = screen.getByText('view');

  // Klikataan 'view' nappia, jotta näkyy 'like' nappi
  await user.click(viewButton);

  // Etsitään like-nappi role:n perusteella, sillä se on varmempi valinta
  const likeButton = screen.getByRole('button', { name: /like/i });

  // Varmistetaan, että like-nappi löytyy ennen kuin klikataan
  expect(likeButton).toBeInTheDocument();

  // Klikataan like-nappia kahdesti
  await user.click(likeButton);
  await user.click(likeButton);

  // Varmistetaan, että blogService.update kutsutaan kahdesti
  expect(blogService.update).toHaveBeenCalledTimes(2);
});
