const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function makeTestUsers() {
  return [
    {
      user_name: 'test',
      password: 'password',
      id: 1
    },
    {
      user_name: 'test2',
      password: 'no',
      id: 2
    },
    {
      user_name: 'test3',
      password: 'nope',
      id: 3
    }
  ];
}

function makeAuthToken(user, secret = process.env.JWT_SECRET) {
  return jwt.sign({ user_id: user.user_id }, secret, {
    subject: user.user_name,
    algorithm: 'HS256'
  });
}

//note: if any test logs have user_id other than 1, need to update the GET logs test
function makeTestLogs() {
  return [
    {
      ski_area: 'test area',
      user_id: 1,
      date: '2019-11-11'
    },
    {
      ski_area: 'test area 2',
      user_id: 1,
      date: '2019-11-12'
    }
  ];
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 7)
  }));
  return db
    .into('users')
    .insert(preppedUsers)
    .then(() => db.raw("SELECT setval('users_id_seq', ?)", [users.length]));
}

function seedLogs(db, logs) {
  return db.into('ski_logs').insert(logs);
}

function cleanTables(db) {
  return db.raw('TRUNCATE users, ski_logs RESTART IDENTITY CASCADE');
}

function makeFixtures() {
  const testUsers = makeTestUsers();
  const testLogs = makeTestLogs();

  return { testUsers, testLogs };
}
module.exports = {
  makeTestUsers,
  makeAuthToken,
  makeTestLogs,
  makeFixtures,
  seedUsers,
  seedLogs,
  cleanTables
};
