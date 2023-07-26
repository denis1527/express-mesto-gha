/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
// eslint-disable-next-line import/no-unresolved
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const routeUsers = require('./routes/users');
const routeCards = require('./routes/cards');

const { ERROR_NOT_FOUND } = require('./errors/errors');

const { PORT = 3000, URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

mongoose.set('strictQuery', true);
mongoose.connect(URL);

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '64c172089fb6632ed991a981',
  };

  next();
});
app.use('/users', routeUsers);
app.use('/cards', routeCards);

app.use((req, res, next) => {
  next(res.status(ERROR_NOT_FOUND).send({ message: 'Страницы по запрошенному URL не существует' }));
});

app.listen(PORT);
