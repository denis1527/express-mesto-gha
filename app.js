const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const routeSignup = require('./routes/signup');
const routeSignin = require('./routes/signin');

const auth = require('./middlewares/auth');

const routeUsers = require('./routes/users');
const routeCards = require('./routes/cards');

const NotFoundError = require('./errors/NotFound');

const { MONGODB_URL = 'mongodb://localhost:27017/mestodb', PORT = 3000 } = process.env;

mongoose.set('strictQuery', true);
mongoose.connect(MONGODB_URL);

const app = express();

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/', routeSignup);
app.use('/', routeSignin);

app.use(auth);

app.use('/users', routeUsers);
app.use('/cards', routeCards);

app.use((req, res, next) => next(new NotFoundError('Страницы по запрошенному URL не существует')));

app.use(errors());

app.use((err, _, res, next) => {
  if (err.name === 'CastError') {
    return res.status(400).send({ message: `Неверный формат ID: ${err.value}` });
  }

  if (err.name === 'ValidationError') {
    const errorMessages = Object.values(err.errors).map((error) => error.message).join(', ');
    return res.status(400).send({ message: errorMessages });
  }

  if (err.name === 'Error') return res.status(err.statusCode).send({ message: err.message });

  if (err.code === 11000) {
    const { statusCode = 409 } = err;

    return res.status(statusCode).send({ message: 'Пользователь с таким электронным адресом уже зарегистрирован' });
  }

  const { statusCode = 500 } = err;
  return next(res.status(statusCode).send({ message: 'На сервере произошла ошибка' }));
});

app.listen(PORT);
