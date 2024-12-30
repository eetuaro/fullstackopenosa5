const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};
const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const favorite = blogs.reduce((prev, current) => {
    return current.likes > prev.likes ? current : prev;
  });

  return favorite;
};
const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const authorCount = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + 1;
    return acc;
  }, {});

  const mostProlificAuthor = Object.entries(authorCount).reduce(
    (prev, current) => {
      return current[1] > prev[1] ? current : prev;
    }
  );

  return {
    author: mostProlificAuthor[0],
    blogs: mostProlificAuthor[1],
  };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const authorLikes = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + blog.likes;
    return acc;
  }, {});

  const mostLikedAuthor = Object.entries(authorLikes).reduce(
    (prev, current) => {
      return current[1] > prev[1] ? current : prev;
    }
  );

  return {
    author: mostLikedAuthor[0],
    likes: mostLikedAuthor[1],
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes, // Lisää mostLikes exportteihin
};
