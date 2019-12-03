const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

const AuthService = {
  getUserWithUserName(db, user_name) {
    return db('users')
      .where({ user_name })
      .first();
  },
  parseBasicToken(token) {
    return Buffer.from(token, 'base64')
      .toString()
      .split(':');
  },
  comparePasswords(password, hash) {
    return bcrypt.compare(password, hash);
  },
  createJwt(subject, payload) {
    return jwt.sign(payload, config.JWT_SECRET, {
      subject,
      algorithm: 'HS256'
    });
  },
  verifyJwt(token) {
    return jwt.verify(token, config.JWT_SECRET, {
      algorithms: ['HS256']
    });
  },
  async addUser(db, user_name, password) {
    let salt = await bcrypt.genSalt(12);
    let hash = await bcrypt.hash(password, salt);
    return db('users')
      .insert({ user_name, password: hash })
      .returning('*')
      .then(rows => rows[0]);
  }
};

module.exports = AuthService;
