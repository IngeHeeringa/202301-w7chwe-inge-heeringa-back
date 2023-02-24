import createDebug from "debug";
import { type NextFunction, type Request, type Response } from "express";
import { CustomError } from "../../CustomError.ts/CustomError.js";

const debug = createDebug("social:generalErrors");

export const notFoundError = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const notFoundError = new CustomError(
    "Path not found",
    404,
    "Endpoint not found"
  );

  next(notFoundError);
};

export const generalError = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  debug(error.message);
  res
    .status(error.statusCode || 500)
    .json({ error: error.publicMessage || "Something went wrong" });
};
