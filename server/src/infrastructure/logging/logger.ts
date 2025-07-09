/**
 * Logger utility for the application
 * Provides a consistent logging interface that can be used throughout the application
 * Implemented using Winston for robust logging capabilities
 */
import winston from 'winston';

interface Logger {
  debug(message: string, ...args: unknown[]): void;
  info(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  error(message: string, ...args: unknown[]): void;
}

/**
 * Winston-based logger implementation
 * Configures Winston with appropriate formats and transports
 */
class WinstonLogger implements Logger {
  private logger: winston.Logger;

  constructor() {
    // Define log format
    const logFormat = winston.format.printf(({ level, message, timestamp, ...meta }) => {
      return `[${timestamp}] [${level.toUpperCase()}] ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
    });

    // Create Winston logger instance with configuration
    this.logger = winston.createLogger({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        logFormat
      ),
      transports: [
        // Console transport for development
        new winston.transports.Console(),
        // File transport for production (logs errors to a file)
        new winston.transports.File({ 
          filename: 'logs/error.log', 
          level: 'error',
          silent: process.env.NODE_ENV !== 'production'
        }),
        // File transport for all logs in production
        new winston.transports.File({ 
          filename: 'logs/combined.log',
          silent: process.env.NODE_ENV !== 'production'
        })
      ],
    });
  }

  debug(message: string, ...args: unknown[]): void {
    this.logger.debug(message, ...(args.length ? [{ meta: args }] : []));
  }

  info(message: string, ...args: unknown[]): void {
    this.logger.info(message, ...(args.length ? [{ meta: args }] : []));
  }

  warn(message: string, ...args: unknown[]): void {
    this.logger.warn(message, ...(args.length ? [{ meta: args }] : []));
  }

  error(message: string, ...args: unknown[]): void {
    this.logger.error(message, ...(args.length ? [{ meta: args }] : []));
  }
}

// Export a singleton instance of the logger
export const logger = new WinstonLogger();
