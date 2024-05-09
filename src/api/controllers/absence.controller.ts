import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { absenceService } from "../services";
import pick from "../../utils/pick";

const createAbsence = catchAsync(async (req: Request, res: Response) => {
  const absence = await absenceService.createAbsence(req.body);
  res.status(httpStatus.CREATED).send(absence);
});

const getAbsence = catchAsync(async (req: Request, res: Response) => {
    const filter = pick(req.query, ["name", "role"]);
    const options = pick(req.query, ["sortBy", "limit", "page"]);
    const result = await absenceService.queryAbsence(filter, options);
    res.send(result);
  });

export { createAbsence, getAbsence };
