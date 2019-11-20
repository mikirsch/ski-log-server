const xss = require('xss');

const SkiLogService = {
  getLogById(db, id) {
    return db('ski_logs')
      .select('*')
      .where('id', id)
      .first();
  },
  getLogsByUserId(db, id) {
    return db('ski_logs')
      .select('*')
      .where('user_id', id);
  },
  getLogsByUserAndTimeRange(db, begin, end, user_id) {
    return db('ski_logs')
      .select('*')
      .whereBetween('date', [begin, end])
      .where('user_id', user_id);
  },
  addLog(db, log) {
    return db('ski_logs')
      .insert(log)
      .returning('*');
  },
  serializeSingleLog(log) {
    return {
      id: log.id,
      date: log.date,
      ski_area: xss(log.ski_area),
      location: xss(log.location),
      notes: log.notes ? xss(log.notes) : null
    };
  },
  serializeLogs(logs) {
    return logs.map(SkiLogService.serializeSingleLog);
  }
};

module.exports = SkiLogService;
