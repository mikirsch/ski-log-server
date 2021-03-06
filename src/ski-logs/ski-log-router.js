const express = require('express');
const path = require('path');
const SkiLogService = require('./ski-log-service');
const { requireAuth } = require('../middleware/jwt-auth');

const skiLogRouter = express.Router();
const jsonBodyParser = express.json();

skiLogRouter
  .route('/')
  .get(requireAuth, (req, res, next) => {
    const user_id = req.user.id;
    const query = req.query;
    const db = req.app.get('db');

    if (query.beginDate) {
      const begin = query.beginDate;
      const end = query.endDate ? query.endDate : begin;
      SkiLogService.getLogsByUserAndTimeRange(db, begin, end, user_id).then(
        logs => {
          if (!logs || logs.length === 0) {
            return res.status(200).json({ logs: [] });
          }
          res.json(SkiLogService.serializeLogs(logs));
        }
      );
    } else {
      SkiLogService.getLogsByUserId(db, user_id).then(logs =>
        res.json(SkiLogService.serializeLogs(logs))
      );
    }
  })
  .post(requireAuth, jsonBodyParser, (req, res, next) => {
    const { date, ski_area, duration, notes, vert } = req.body;
    const newLog = { date, ski_area }; //required

    for (const [k, v] of Object.entries(newLog)) {
      if (!v) {
        //null or otherwise falsy (e.g. empty string)
        return res.status(400).json({ error: `Missing ${k} in request body` });
      }
    }

    newLog.notes = notes ? notes : null;
    newLog.duration = duration;
    newLog.vert = vert;

    newLog.user_id = req.user.id;

    SkiLogService.addLog(req.app.get('db'), newLog)
      .then(log =>
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${log.id}`))
          .json(SkiLogService.serializeSingleLog(log))
      )
      .catch(next);
  });

module.exports = skiLogRouter;
