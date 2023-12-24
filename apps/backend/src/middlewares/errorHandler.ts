import { Request, Response, NextFunction } from "express";
import { DEBUG_MODE } from "../config";
import { ValidationError } from "zod-validation-error";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Your error handling logic here
  let statusCode: number = 500;

  let data: { message: string; originalError?: string } = {
    message: "Internal Server Error",
    ...(DEBUG_MODE === "true" && { originalError: err.message }),
  };

  if (err instanceof Error) {
    // needs improvements
    (statusCode = 422),
      (data = {
        message: `${err.message}`,
      });
  }
  return res.status(statusCode).json(data);
};

export default errorHandler;
