const jwt = require('jsonwebtoken');

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('Authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7); // Poistaa "Bearer " ja asettaa tokenin
  } else {
    request.token = null;
  }
  next(); // Kutsutaan seuraavaa middlewarea tai reittiä
};

module.exports = tokenExtractor;
