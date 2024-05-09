import express, { Request, Response, NextFunction } from 'express';
import morgan, { StreamOptions } from 'morgan';
import config from './config';  // Make sure to export appropriately in config.ts
import logger from './logger';  // Make sure to export appropriately in logger.ts

// Custom token for logging messages
morgan.token('message', (req: Request, res: Response) => res.locals.errorMessage || '');

// Helper function to format IP based on environment
const getIpFormat = (): string => (config.env === 'production' ? ':remote-addr - ' : '');

// Define log formats
const successResponseFormat: string = `${getIpFormat()}:method :url :status - :response-time ms`;
const errorResponseFormat: string = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`;

// Define custom logging rules for successful responses
const morganSuccessHandler = morgan(successResponseFormat, {
  skip: (req: Request, res: Response) => res.statusCode >= 400,
  stream: {
    write: (message: string) => logger.info(message.trim())
  } as StreamOptions,
});

// Define custom logging rules for error responses
const morganErrorHandler = morgan(errorResponseFormat, {
  skip: (req: Request, res: Response) => res.statusCode < 400,
  stream: {
    write: (message: string) => logger.error(message.trim())
  } as StreamOptions,
});

export { morganSuccessHandler, morganErrorHandler };
