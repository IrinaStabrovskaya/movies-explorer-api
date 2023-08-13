const express = require('express');

const mongoose = require('mongoose');

const helmet = require('helmet');

const { errors } = require('celebrate');

const cors = require('cors');

const errorHandler = require('./middlewares/error-handler');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const routes = require('./routes/index');

const app = express();

// const { PORT } = process.env;

const { SERVER_PORT, DB } = require('./utils/config');

mongoose.connect(DB);

app.use(express.json());

app.use(helmet());

app.use(cors());

app.use(requestLogger);

app.use(routes);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(SERVER_PORT);
