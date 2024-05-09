import jwt from "jsonwebtoken";
import moment from "moment";
import httpStatus from "http-status";
import config from "../../config/config";
import * as userService from "./user.service";
import { Token, IToken, IUser } from "../models";
import { ApiError } from "../../utils/ApiError";
import { tokenTypes } from "../../config/tokens";

/**
 * Generate token
 * @param userId - MongoDB User ID
 * @param expires - Expiration time as a moment object
 * @param type - Type of the token (access, refresh, etc.)
 * @param secret - Secret key for signing the token (defaults to config.jwt.secret)
 * @returns The signed JWT token as a string
 */
const generateToken = (
  userId: string,
  expires: moment.Moment,
  type: string,
  secret: string = config.jwt.secret
): string => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

/**
 * Save a token to the database
 * @param token - Token string to save
 * @param userId - MongoDB User ID
 * @param expires - Expiration time as a moment object
 * @param type - Type of the token
 * @param blacklisted - Whether the token is blacklisted (defaults to false)
 * @returns The saved token document
 */
const saveToken = async (
  token: string,
  userId: string,
  expires: moment.Moment,
  type: string,
  blacklisted: boolean = false
): Promise<IToken> => {
  const tokenDoc = new Token({
    token,
    user: userId,
    expires: expires.toDate(),
    type,
    blacklisted,
  });
  await tokenDoc.save();
  return tokenDoc;
};

/**
 * Verify token validity and return token doc
 * @param token - Token string to verify
 * @param type - Type of the token
 * @returns The token document if verification is successful
 */
const verifyToken = async (token: string, type: string): Promise<IToken> => {
  const payload = jwt.verify(token, config.jwt.secret) as jwt.JwtPayload;
  const tokenDoc = await Token.findOne({
    token,
    type,
    user: payload.sub,
    blacklisted: false,
  });
  if (!tokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, "Token not found");
  }
  return tokenDoc;
};

/**
 * Generate authentication tokens (access and refresh)
 * @param user - The user for whom to generate the tokens
 * @returns An object containing the access and refresh tokens
 */
const generateAuthTokens = async (
  user: IUser
): Promise<{
  access: { token: string; expires: Date };
  refresh: { token: string; expires: Date };
}> => {
  const accessTokenExpires = moment().add(
    config.jwt.accessExpirationMinutes,
    "minutes"
  );
  const accessToken = generateToken(
    user.id,
    accessTokenExpires,
    tokenTypes.ACCESS
  );

  const refreshTokenExpires = moment().add(
    config.jwt.refreshExpirationDays,
    "days"
  );
  const refreshToken = generateToken(
    user.id,
    refreshTokenExpires,
    tokenTypes.REFRESH
  );
  await saveToken(
    refreshToken,
    user.id,
    refreshTokenExpires,
    tokenTypes.REFRESH
  );

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

/**
 * Generate a reset password token
 * @param email - The email address of the user who forgot their password
 * @returns The reset password token
 */
const generateResetPasswordToken = async (email: string): Promise<string> => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "No users found with this email");
  }
  const expires = moment().add(
    config.jwt.resetPasswordExpirationMinutes,
    "minutes"
  );
  const resetPasswordToken = generateToken(
    user.id,
    expires,
    tokenTypes.RESET_PASSWORD
  );
  await saveToken(
    resetPasswordToken,
    user.id,
    expires,
    tokenTypes.RESET_PASSWORD
  );
  return resetPasswordToken;
};

/**
 * Generate a token for verifying email address
 * @param user - The user whose email needs to be verified
 * @returns The email verification token
 */
const generateVerifyEmailToken = async (user: IUser): Promise<string> => {
  const expires = moment().add(
    config.jwt.verifyEmailExpirationMinutes,
    "minutes"
  );
  const verifyEmailToken = generateToken(
    user.id,
    expires,
    tokenTypes.VERIFY_EMAIL
  );
  await saveToken(verifyEmailToken, user.id, expires, tokenTypes.VERIFY_EMAIL);
  return verifyEmailToken;
};

export {
  generateToken,
  saveToken,
  verifyToken,
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailToken,
};
