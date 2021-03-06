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
      .returning('*')
      .then(rows => rows[0]);
  },
  serializeSingleLog(log) {
    const sanitized = { ...log };
    const riskyKeys = ['ski_area', 'notes'];
    for (let key of riskyKeys) {
      sanitized[key] = xss(sanitized[key]);
    }
    return sanitized;
  },
  serializeLogs(logs) {
    return logs.map(SkiLogService.serializeSingleLog);
  }
};

module.exports = SkiLogService;
