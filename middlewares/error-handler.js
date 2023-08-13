const { INTERNAL_SERVER_ERROR } = require('../constants/errors');

const errorHandler = (err, req, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  } else {
    res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
  }
  next();
};

module.exports = errorHandler;
