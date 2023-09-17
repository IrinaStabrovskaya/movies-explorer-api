const { celebrate, Joi } = require('celebrate');

// const API_FILMS_URL = 'https://api.nomoreparties.co';

// eslint-disable-next-line max-len, no-useless-escape
const urlPattern = /^(https?):\/\/(www\.)?([a-z0-9-]{2,})\.([a-z0-9-]{2,})\.?([a-z0-9-]{2,})?\/?(([-._~:\/?#[\]@!$&'()*+,;=a-zA-Z0-9]*)?)#?$/;

// eslint-disable-next-line max-len, no-useless-escape
// const urlPatternCut = /^\/([a-z0-9-]{2,})\/?(([-._~:\/?#[\]@!$&'()*+,;=a-zA-Z0-9]*)?)#?$/;

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const validateUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email(),
  }),
});

const validateSaveMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().pattern(urlPattern).required(),
    trailerLink: Joi.string().pattern(urlPattern).required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().pattern(urlPattern).required(),
    movieId: Joi.number().required(),
  }).unknown(true),
});

const validateDeleteMovie = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().length(24).hex().required(),
  }),
});

module.exports = {
  validateCreateUser,
  validateLogin,
  validateUpdateUser,
  validateSaveMovie,
  validateDeleteMovie,
};
