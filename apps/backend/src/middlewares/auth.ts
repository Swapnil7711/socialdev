import { Request, Response, NextFunction } from "express";
import JwtService from "../services/JwtService";
import CustomErrorHandler from "../services/CustomErrorHandler";

// Extend the Request type to include the 'user' property
interface CustomRequest extends Request {
  user?: string; // Replace 'string' with the actual type of your user ID
}

const auth = (req: CustomRequest, res: Response, next: NextFunction) => {
  const token: string | undefined = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return next(CustomErrorHandler.unAutorised("You are not authorised"));
  }
  try {
    console.log(req.body);
    const result = JwtService.verifyToken(token);
    req.user = result.id;
    console.log("authhhh", req.user);
  } catch (error) {
    return next(CustomErrorHandler.unAutorised("You are not authorised"));
  }

  next();
};

export default auth;
