const express = require('express');
const AuthService = require('./auth-service');

const authRouter = express.Router();
const jsonBodyParser = express.json();

authRouter.post('/', jsonBodyParser, (req, res, next) => {
  const { user_name, password } = req.body;
  const submitted = { user_name, password };

  for (const [key, val] of Object.entries(submitted)) {
    if (val == null) {
      return res
        .status(400)
        .json({ error: `Missing '${key}' in request body` });
    }
  }

  AuthService.getUserWithUserName(req.app.get('db'), submitted.user_name)
    .then(user => {
      if (!user) {
        return res
          .status(400)
          .json({ error: 'Incorrect user name or password' });
      }
      return AuthService.comparePasswords(
        submitted.password,
        user.password
      ).then(match => {
        if (!match) {
          return res
            .status(400)
            .json({ error: 'Incorrect user name or password' });
        }

        const sub = user.user_name;
        const payload = { user_id: user.id };
        res.send({ authToken: AuthService.createJwt(sub, payload) });
      });
    })
    .catch(next);
});

module.exports = authRouter;
