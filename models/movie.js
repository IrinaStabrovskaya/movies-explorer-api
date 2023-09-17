const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');

const API_FILMS_URL = 'https://api.nomoreparties.co';

const movieSchema = new mongoose.Schema(
  {
    nameRU: {
      type: String,
      required: true,
    },

    nameEN: {
      type: String,
      required: true,
    },

    country: {
      type: String,
      required: true,
    },

    director: {
      type: String,
      required: true,
    },

    duration: {
      type: Number,
      required: true,
    },

    year: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
      validate: {
        validator: (link) => isURL(`${API_FILMS_URL}${link}`),
        message: 'Некорректная ссылка',
      },
    },

    thumbnail: {
      type: String,
      required: true,
      validate: {
        validator: (link) => isURL(`${API_FILMS_URL}${link}`),
        message: 'Некорректная ссылка',
      },
    },

    trailerLink: {
      type: String,
      required: true,
      validate: {
        validator: (link) => isURL(link),
        message: 'Некорректная ссылка',
      },
    },

    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    movieId: {
      type: Number,
      required: true,
    },
  },
);

module.exports = mongoose.model('Movie', movieSchema);
