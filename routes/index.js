const router = require('express').Router();
const userRoutes = require('./users');
const movieRoutes = require('./movies');
const { createUser, login } = require('../controllers/users');
const NotFound = require('../errors/not-found');
const auth = require('../middlewares/auth');
const {
  validateCreateUser,
  validateLogin,
} = require('../utils/validateJoiSchema');

router.use('/signup', validateCreateUser, createUser);
router.use('/signin', validateLogin, login);
router.use('/users', auth, userRoutes);
router.use('/movies', auth, movieRoutes);
router.use('/*', auth, (req, res, next) => next(new NotFound('Страница не найдена')));

module.exports = router;
