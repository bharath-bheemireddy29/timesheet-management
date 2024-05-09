import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import xss from "xss";
import mongoSanitize from "express-mongo-sanitize";
import compression from "compression";
import cors from "cors";
import passport from "passport";
import httpStatus from "http-status";
import config from "./config/config";
import { morganSuccessHandler, morganErrorHandler } from "./config/morgan";
import { jwtStrategy } from "./config/passport";
import { authLimiter } from "./api/middlewares/rateLimiter";
import routes from "./api/routes/v1";
import { errorConverter, errorHandler } from "./api/middlewares/error";
import { ApiError } from "./utils/ApiError";
import insertUsers from './services/dumpUsers';

const app = express();

if (config.env !== "test") {
  app.use(morganSuccessHandler);
  app.use(morganErrorHandler);
}

// Set security HTTP headers
app.use(helmet());

// Parse json request body
app.use(express.json());

// Parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// Sanitize request data
app.use((req: Request, res: Response, next: NextFunction) => {
  req.body = Object.keys(req.body).reduce((acc, key) => {
    acc[key] = xss(req.body[key]);
    return acc;
  }, {} as any);
  next();
});
app.use(mongoSanitize());

// Gzip compression
app.use(compression());

// Enable CORS
app.use(cors());
app.options("*", cors());

// JWT authentication
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

// Limit repeated failed requests to auth endpoints
if (config.env === "production") {
  app.use("/v1/auth", authLimiter);
}

// v1 api routes
app.use("/v1", routes);

// Send back a 404 error for any unknown api request
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// Convert error to ApiError, if needed
app.use(errorConverter);

// Handle errors
app.use(errorHandler);



export default app;
