import { Request, Response, NextFunction } from "express";
import JwtService from "../services/JwtService";
import CustomErrorHandler from "../services/CustomErrorHandler";

const auth = (req: Request, res: Response, next: NextFunction) => {
  const token: string | undefined = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return next(CustomErrorHandler.unAutorised("You are not authorised"));
  }
  console.log(token);
  try {
    const user = JwtService.verifyToken(token);
    req.body.user = user;
  } catch (error) {
    return next(CustomErrorHandler.unAutorised("You are not authorised"));
  }

  next();
};

export default auth;
