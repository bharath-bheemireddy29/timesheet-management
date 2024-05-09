import httpStatus from "http-status";
import AbsenceEntry, { IAbsenceEntry } from "../models/absence.model";
import { ApiError } from "../../utils/ApiError";
import User, { QueryResult } from "../models/user.model";

export const createAbsence = async (
  absenceBody: any
): Promise<IAbsenceEntry> => {
  if (await User.isEmailTaken(absenceBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }
  return AbsenceEntry.create(absenceBody);
};

export const queryAbsence = async (
  filter: any,
  options: any
): Promise<QueryResult<IAbsenceEntry>> => {
  const users = (await AbsenceEntry.paginate(
    filter,
    options
  )) as QueryResult<IAbsenceEntry>;
  return users;
};
