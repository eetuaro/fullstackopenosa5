import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlogForm from '../components/blogForm';
import { vi } from 'vitest';
import blogService from '../services/blogs';

vi.mock('../services/blogs');

test('calls the given callback with correct data when a new blog is created', async () => {
  const setBlogs = vi.fn();
  const setSuccessMessage = vi.fn();
  const setErrorMessage = vi.fn();

  render(
    <BlogForm
      blogs={[]}
      setBlogs={setBlogs}
      setSuccessMessage={setSuccessMessage}
      setErrorMessage={setErrorMessage}
    />
  );

  const user = userEvent.setup();

  const titleInput = screen.getByLabelText('title');
  const authorInput = screen.getByLabelText('author');
  const urlInput = screen.getByLabelText('url');
  const submitButton = screen.getByText('create');

  await user.type(titleInput, 'Test Blog');
  await user.type(authorInput, 'Test Author');
  await user.type(urlInput, 'http://testblog.com');

  blogService.create.mockResolvedValue({
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://testblog.com',
  });

  await user.click(submitButton);

  await waitFor(() => {
    expect(setSuccessMessage).toHaveBeenCalledWith(
      'A new blog "Test Blog" by Test Author added.'
    );
  });

  expect(setBlogs).toHaveBeenCalledWith(expect.any(Array));
});
