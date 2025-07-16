import path from 'path';
import fs from 'fs';
import winston from 'winston';
import morgan from 'morgan';
import { Request, Response } from 'express';

// 📁 Ensure logs directory exists
const logDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// 🧱 Winston custom log format
const logFormat = winston.format.printf(({ timestamp, level, message }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// 🧱 Winston logger instance
const logger = winston.createLogger({
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
  },
  format: winston.format.combine(
    winston.format.timestamp(),
    logFormat
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
    }),
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
    }),
  ],
});

// 🎨 Console output for development
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      level: 'http',
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

// 🧾 Morgan → Winston stream
const stream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

// ❌ Skip logging during tests (optional)
const skip = () => process.env.NODE_ENV === 'test';

// 🧠 Custom Morgan format
const customMorganFormat = (
  tokens: morgan.TokenIndexer<Request, Response>,
  req: Request,
  res: Response
): string => {
  const method = tokens.method(req, res);
  const url = tokens.url(req, res);
  const status = tokens.status(req, res);
  const responseTime = tokens['response-time'](req, res);
  const ip = req.ip || req.socket.remoteAddress;
  const userAgent = tokens['user-agent'](req, res);
  const timestamp = new Date().toISOString();

  // Optional: log request body for POST/PUT
  let body = '';
  if (['POST', 'PUT', 'PATCH'].includes(method!)) {
    body = ` | Body: ${JSON.stringify(req.body)}`;
  }

  return `[HTTP] ${timestamp} | ${status} | ${method} ${url} | ${responseTime} ms | IP: ${ip} | Agent: ${userAgent}${body}`;
};

// 🧩 Morgan middleware
const morganMiddleware = morgan("tiny", { stream, skip });

// ✅ Exports
export { logger };
export default morganMiddleware;
