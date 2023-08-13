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

const auth = require('../middlewares/auth');

router.get('/', getMovies);

router.post('/', auth, validateSaveMovie, saveMovie);

router.delete('/:_id', auth, validateDeleteMovie, deleteMovie);

module.exports = router;
