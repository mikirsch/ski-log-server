const express = require('express');
const path = require('path');
const SkiLogService = require('./ski-log-service');

const skiLogRouter = express.Router();
const jsonBodyParser = express.json();

skiLogRouter
  .route('/')
  .get((req, res, next) => {
    const user_id = 1; //TODO: TEMPORARY UNTIL AUTH IS IN PLACE
    SkiLogService.getLogsByUserId(req.app.get('db'), user_id).then(logs =>
      res.json(SkiLogService.serializeLogs(logs))
    );
  })
  .post(jsonBodyParser, (req, res, next) => {
    const { date, ski_area, location, notes } = req.body;
    const newLog = { date, ski_area, location }; //required

    for (const [k, v] of Object.entries(newLog)) {
      if (v == null) {
        return res.status(400).json({ error: `Missing ${k} in request body` });
      }
    }
    if (notes) {
      //don't bother with null or empty string
      newLog.notes = notes;
    }

    newLog.user_id = 1; //TODO: TEMPORARY UNTIL AUTH IS IN PLACE

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
