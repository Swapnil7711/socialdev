import { Request, Response, NextFunction } from "express";
import { registerSchema } from "common";
import { fromZodError } from "zod-validation-error";
import CustomErrorHandler from "../../services/CustomErrorHandler";

export interface APIRequestParams {
  email?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  password?: string;
  repeatpassword?: string;
}

const registerController = {
  async register(req: Request, res: Response, next: NextFunction) {
    // validate the request with zod or joi
    const result = registerSchema.safeParse(req.body);
    if (!result.success) {
      const validationError = fromZodError(result.error);
      return next(validationError);
    }

    // authorise the request

    // check if user is already in the database

    try {
      const exists: boolean = true;

      if (exists) {
        return next(CustomErrorHandler.alreadyExists("User already exists"));
      }
    } catch (error) {
      console.log(error);
    }

    // prepare model
    // store ion database
    // generate jwt token
    // send response

    res.json({ msg: "message" });
  },
};

export default registerController;
