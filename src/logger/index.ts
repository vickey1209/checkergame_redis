import winston, { createLogger, transports, format } from "winston";

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.colorize({ all: true }),
    format.timestamp({ format: "YYY-MM-DD HH:MM:ss:SSS" }),
    format.printf((info) => {
      return `${[info.timestamp]} : ${[info.level]} : ${[info.message]}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new transports.File({
      filename: "info.log",
      level: "info",
      format: format.combine(
        format.colorize({ all: true }),
        format.timestamp({ format: "YYY-MM-DD HH:MM:ss:SSS" }),
        format.json()
      ),
    }),
    new transports.File({
      filename: "error.log",
      level: "error",
      format: format.combine(
        format.colorize({ all: true }),
        format.timestamp({ format: "YYY-MM-DD HH:MM:ss:SSS" }),
        format.json()
      ),
    }),
  ],
});

winston.addColors({
  error: "red",
  warn: "yellow",
  info: "blue",
});

export default logger;
