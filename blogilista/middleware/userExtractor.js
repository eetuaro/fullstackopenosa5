// middleware/userExtractor.js
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userExtractor = async (request, response, next) => {
  // Otetaan token Authorization-headerista
  const token = request.token;
  if (!token) {
    return response.status(401).json({ error: 'Token puuttuu' });
  }

  try {
    // Dekoodataan token ja haetaan käyttäjän tiedot
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'Token invalid' });
    }

    // Haetaan käyttäjä tokenin perusteella
    const user = await User.findById(decodedToken.id);
    if (!user) {
      return response.status(401).json({ error: 'User not found' });
    }

    // Lisätään käyttäjä request-olioon
    request.user = user;
    next(); // Jatketaan seuraavaan middlewareen tai reittikäsittelijään
  } catch (error) {
    console.error(error);
    return response
      .status(400)
      .json({ error: 'Virhe käyttäjätiedon hakemisessa' });
  }
};

module.exports = userExtractor;
