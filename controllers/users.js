const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequest = require('../errors/bad-request');
const Conflict = require('../errors/conflict');
const Unauthorized = require('../errors/unauthorized');
const NotFound = require('../errors/not-found');
const {
  CREATED,
} = require('../constants/errors');

const { SALT_ROUNDS } = require('../constants/data');

const { JWT_SECRET } = process.env;

// запрос своих данных
const getUser = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then((userData) => res.send(userData))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequest('Переданы некорректные данные при поиске пользователя'));
      }
      return next(err);
    });
};

// функция запроса обновления данных пользователя
const updateUser = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .orFail(() => new Error('NotValidId'))
    .then((userData) => {
      res.send(userData);
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        return next(new NotFound('Пользователь не найден'));
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequest('Переданы некорректные данные при обновлении профиля'));
      }
      return next(err);
    });
};

// запрос на создание пользователя, его регистрация
const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  return bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((userData) => {
      res.status(CREATED).send(userData);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new Conflict('Пользователь уже существует'));
      }
      return next(err);
    });
};

// авторизация пользователя
const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .orFail(() => new Error('EmailNotFound'))
    .then((user) => bcrypt.compare(password, user.password)
      .then((matched) => {
        if (!matched) {
          throw new Unauthorized('Неправильные почта или пароль');
        }
        return res.send({
          token: jwt.sign({ _id: user._id }, process.env.NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' }),
        });
      }))
    .catch((err) => {
      if (err.message === 'EmailNotFound') {
        return next(new Unauthorized('Неправильные почта или пароль'));
      }
      return next(err);
    });
};

module.exports = {
  getUser,
  createUser,
  updateUser,
  login,
};
