const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

const Unauthorized = require('../errors/unauthorized');

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new Unauthorized('Нет доступа, нужна авторизация'));
    return;
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, process.env.NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new Unauthorized('Нет доступа, нужна авторизация'));
    return;
  }
  req.user = payload;

  next();
};
