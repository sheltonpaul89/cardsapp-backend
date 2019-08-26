let winston = require('winston');
let DailyRotateFile = require('winston-daily-rotate-file');
const logger = winston.createLogger({
    exitOnError: false,
    level: 'debug',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [
      new DailyRotateFile({
        name: 'file',
        filename: './logs/server_log',
        maxSize: '10m'
      })
    ]
  });

module.exports = {
    logger
}