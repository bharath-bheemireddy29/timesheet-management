import { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Higher-order function for handling exceptions inside of async express routes
 * and passing them to your express error handlers.
 * @param fn The async function to wrap with exception handling
 * @returns Wrapped async function with centralized error handling
 */
const catchAsync =
  (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
  ): RequestHandler =>
  (req, res, next) => {
    fn(req, res, next).catch(next);
  };

export default catchAsync;
