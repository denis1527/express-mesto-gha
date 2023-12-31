const jwt = require('jsonwebtoken');

const UnauthorizedError = require('../errors/Unauthorized');

module.exports = (req, _, next) => {
  const { authorization } = req.headers;
  const secretSigningKey = process.env.JWT_SECRET;
  const bearer = 'Bearer ';

  if (!authorization || !authorization.startsWith(bearer)) {
    return next(new UnauthorizedError('Неправильные почта или пароль'));
  }

  const token = authorization.replace(bearer, '');
  let payload;

  try {
    payload = jwt.verify(token, secretSigningKey);
  } catch (err) {
    return next(new UnauthorizedError('Неправильные почта или пароль'));
  }

  req.user = payload;

  return next();
};

