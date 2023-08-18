const mongoose = require('mongoose');
const Movie = require('../models/movie');
const BadRequest = require('../errors/bad-request');
const Forbidden = require('../errors/forbidden');
const NotFound = require('../errors/not-found');
const { CREATED } = require('../constants/errors');
const { API_FILMS_URL } = require('../constants/data');

// получение всех сохраненных фильмов
const getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => {
      res.send(movies);
    })
    .catch((err) => next(err));
};

// Сохранение нового фильма к себе в коллекцию
const saveMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    thumbnail,
    trailerLink,
    nameRU,
    nameEN,
    movieId = req.body.id,
  } = req.body;
  const id = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image: `${API_FILMS_URL}${image}`,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail: `${API_FILMS_URL}${thumbnail}`,
    owner: id,
    movieId,
  })
    .then((newMovie) => res.status(CREATED).send(newMovie))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(
          new BadRequest('Переданы некорректные данные при сохранении фильма'),
        );
      }
      return next(err);
    });
};

// Удаление фильма
const deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .then((movieData) => {
      if (!movieData) {
        throw new NotFound('Фильм с указанным _id не найден');
      }
      if (!movieData.owner.equals(req.user._id)) {
        throw new Forbidden('Вы не можете удалить чужой фильм');
      }
      Movie.deleteOne(movieData)
        .then(() => res.send(movieData))
        .catch(next);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(
          new BadRequest('Переданы некорректные данные при удалении фильма'),
        );
      }
      return next(err);
    });
};

module.exports = {
  getMovies,
  saveMovie,
  deleteMovie,
};
