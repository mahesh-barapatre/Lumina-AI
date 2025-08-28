// src/logger.js
const { createLogger, format, transports } = require("winston");

const logger = createLogger({
  level: "info", // log levels: error, warn, info, verbose, debug, silly
  format: format.combine(
    format.colorize(), // adds colors
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
  transports: [
    new transports.Console(), // logs to console only
  ],
});

module.exports = logger;
