require('dotenv').config();
process.env.TZ = 'UTC';
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'foo';

const { expect } = require('chai');
const supertest = require('supertest');

global.expect = expect;
global.supertest = supertest;
