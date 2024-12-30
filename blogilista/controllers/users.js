const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const router = express.Router();

router.post('/', async (req, res) => {
  const { username, password, name } = req.body;

  if (!username || !password || !name) {
    return res
      .status(400)
      .json({ error: 'Username, password, and name are required' });
  }

  if (username.length < 3) {
    return res
      .status(400)
      .json({ error: 'Username must be at least 3 characters long.' });
  }

  if (password.length < 3) {
    return res
      .status(400)
      .json({ error: 'Password must be at least 3 characters long.' });
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ error: 'Username already taken' });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  try {
    const savedUser = await user.save();
    res.status(201).json({
      username: savedUser.username,
      name: savedUser.name,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

router.get('/', async (req, res) => {
  try {
    const users = await User.find({}).populate('blogs', {
      title: 1,
      url: 1,
      likes: 1,
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

module.exports = router;
