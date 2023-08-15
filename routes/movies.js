const router = require('express').Router();

const {
  validateSaveMovie,
  validateDeleteMovie,
} = require('../utils/validateJoiSchema');

const {
  getMovies,
  saveMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovies);

router.post('/', validateSaveMovie, saveMovie);

router.delete('/:_id', validateDeleteMovie, deleteMovie);

module.exports = router;
