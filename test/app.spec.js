const app = require('../src/app');
const knex = require('knex');
const helpers = require('./helpers');
const jwt = require('jsonwebtoken');

describe('App', () => {
  const { testUsers, testLogs } = helpers.makeFixtures();

  const token = helpers.makeAuthToken(testUsers[0]);
  const auth = `Bearer ${token}`;
  let db;
  before('instantiate knex', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL
    });
    app.set('db', db);
  });

  before('cleanup', async () => {
    await helpers.cleanTables(db);
  });

  beforeEach('prep DB', async () => {
    await helpers.seedUsers(db, testUsers);
    await helpers.seedLogs(db, testLogs);
  });

  afterEach('cleanup', async () => {
    await helpers.cleanTables(db);
  });

  after('destroy knex', () => {
    db.destroy();
  });
  describe('Login', () => {
    it('POST /api/login responds with bearer token when given correct username/password', () => {
      return supertest(app)
        .post('/api/login')
        .send(testUsers[0])
        .expect(200)
        .expect(res => {
          const { authToken } = res.body;
          const token = jwt.decode(authToken);
          return expect(token.sub).to.equal(testUsers[0].user_name);
        });
    });

    it('POST /api/login responds 400 and error message with good username and bad password', () => {
      return supertest(app)
        .post('/api/login')
        .send({ user_name: testUsers[0].user_name, password: 'foo' })
        .expect(400, { error: 'Incorrect user name or password' });
    });

    it('POST /api/login responds 400 and error message with bad username', () => {
      return supertest(app)
        .post('/api/login')
        .send({ user_name: testUsers[0].user_name + 'foo', password: 'foo' })
        .expect(400, { error: 'Incorrect user name or password' });
    });
  });
  describe('Signup', () => {
    it('POST /api/signup returns 201 and auth token for new user', () => {
      return supertest(app)
        .post('/api/signup')
        .send({ user_name: 'new user name', password: 'foo' })
        .expect(201)
        .expect(res => {
          const { authToken } = res.body;
          const token = jwt.decode(authToken);
          return expect(token.sub).to.equal('new user name');
        });
    });
    it('POST /api/signup returns 400 and error message if missing key', () => {
      return supertest(app)
        .post('/api/signup')
        .send({ user_name: 'new user name' })
        .expect(400, { error: "Missing 'password' in request body" });
    });
    it('POST /api/signup returns 409 and error message if username conflicts', () => {
      const { user_name, password } = testUsers[0];
      return supertest(app)
        .post('/api/signup')
        .send({ user_name, password })
        .expect(409, { error: 'User name already exists' });
    });
  });
  describe('Logs', () => {
    it('GET /api/logs gets logs belonging to the user', () => {
      //currently assuming that all test logs belong to testUser[0]
      return supertest(app)
        .get('/api/logs')
        .set('Authorization', auth)
        .expect(200)
        .expect(res => {
          //server returns all fields even if null, so need to only look at what we sent in
          for (const idx in res.body) {
            const old = testLogs[idx];
            const log = res.body[idx];
            if (
              old.ski_area === log.ski_area &&
              old.user_id === log.user_id &&
              old.date === log.date.slice(0, 10) //returned in ISO format, trim down to match
            ) {
              continue;
            } else {
              return false;
            }
          }
        });
    });
    it('POST /api/logs returns 201 and a representation of the log', () => {
      const newLog = {
        ski_area: 'test area 3',
        user_id: 1,
        date: '2019-11-13'
      };
      return supertest(app)
        .post('/api/logs')
        .set('Authorization', auth)
        .send(newLog)
        .expect(201)
        .expect(
          res =>
            res.body.ski_area === newLog.ski_area &&
            res.body.user_id === newLog.user_id &&
            res.body.date.slice(0, 10) === newLog.date
        );
    });
  });
  describe('Protected endpoints', () => {
    context('with missing token', () => {
      it('GET /api/logs returns 401 and error', () => {
        return supertest(app)
          .get('/api/logs')
          .expect(401, { error: 'Missing bearer token' });
      });
      it('POST /api/logs returns 401 and error', () => {
        return supertest(app)
          .post('/api/logs')
          .send({ body: 'foo' })
          .expect(401, { error: 'Missing bearer token' });
      });
    });
    context('with invalid token', () => {
      const badToken = helpers.makeAuthToken(testUsers[0], 'bad secret');
      const badAuth = `Bearer ${badToken}`;
      it('GET /api/logs returns 401 and error', () => {
        return supertest(app)
          .get('/api/logs')
          .set('Authorization', badAuth)
          .expect(401, { error: 'Unauthorized request' });
      });
      it('POST /api/logs returns 401 and error', () => {
        return supertest(app)
          .post('/api/logs')
          .set('Authorization', badAuth)
          .send({ body: 'foo' })
          .expect(401, { error: 'Unauthorized request' });
      });
    });
  });
});
