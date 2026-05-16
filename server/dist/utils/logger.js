import { createLogger, format, transports } from "winston";
const { combine, timestamp, printf, colorize, errors, json } = format;
const logger = createLogger({
    level: "info",
    format: combine(timestamp(), errors({ stack: true })),
    transports: [
        new transports.Console({
            format: combine(colorize(), printf(({ level, message, timestamp, stack }) => { return `${timestamp}   [${level}]: ${stack || message}  `; }))
        }),
        new transports.File({
            filename: 'logs/errors.log',
            level: "error",
            format: json()
        }),
        new transports.File({
            filename: "logs/combined.logs",
            format: json()
        })
    ]
});
export default logger;
//# sourceMappingURL=logger.js.map