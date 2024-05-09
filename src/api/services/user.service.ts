import httpStatus from 'http-status';
import User,{ IUser, QueryResult } from '../models/user.model';
import { ApiError } from '../../utils/ApiError';

export const createUser = async (userBody: any): Promise<IUser> => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return User.create(userBody);
};

export const queryUsers = async (filter: any, options: any): Promise<QueryResult<IUser>> => {
  const users = await User.paginate(filter, options) as QueryResult<IUser>;
  return users;
};

export const getUserById = async (id: string): Promise<IUser | null> => {
  return User.findById(id);
};

export const getUserByEmail = async (email: string): Promise<IUser | null> => {
  return User.findOne({ email });
};

export const updateUserById = async (userId: string, updateBody: any): Promise<IUser> => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

export const deleteUserById = async (userId: string): Promise<IUser> => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};
