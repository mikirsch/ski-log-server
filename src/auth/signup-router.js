const express = require('express');
const AuthService = require('./auth-service');

const signupRouter = express.Router();
const jsonBodyParser = express.json();

signupRouter.post('/', jsonBodyParser, (req, res, next) => {
  const { user_name, password } = req.body;
  const submitted = { user_name, password };

  for (const [key, val] of Object.entries(submitted)) {
    if (val == null) {
      return res
        .status(400)
        .json({ error: `Missing '${key}' in request body` });
    }
  }
  const db = req.app.get('db');
  AuthService.getUserWithUserName(db, submitted.user_name)
    .then(user => {
      if (user) {
        return res.status(409).json({ error: 'User name already exists' });
      }
      AuthService.addUser(db, submitted.user_name, submitted.password)
        .then(response => {
          const sub = response.user_name;
          const payload = { user_id: response.id };
          res.send({ authToken: AuthService.createJwt(sub, payload) });
        })
        .catch(err => console.log(err));
    })
    .catch(next);
});

module.exports = signupRouter;
