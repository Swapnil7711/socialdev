import { loginSchema } from "common";
import { Request, Response, NextFunction } from "express";
import { fromZodError, ZodError } from "zod-validation-error";
import prisma from "../../utils/prismaClient";
import CustomErrorHandler from "../../services/CustomErrorHandler";
import bcrypt from "bcryptjs";
import { UserType } from "@socialdev/types/AppTypes";
import JwtService from "../../services/JwtService";

interface ValidationResult<T> {
  success: boolean;
  data?: T;
  error?: ZodError;
}

const loginController = {
  async login(req: Request, res: Response, next: NextFunction) {
    // validate the user request with zod
    const result: ValidationResult<typeof req.body> = loginSchema.safeParse(
      req.body
    );
    if (!result.success) {
      const validationError = fromZodError(result.error!);
      return next(validationError);
    }

    // if success the check if user exists in database

    try {
      const user: UserType | null = await prisma.user.findFirst({
        where: { email: req.body.email },
      });
      if (!user) {
        return next(
          CustomErrorHandler.wrongCredentials("You have entered wrong email!")
        );
      }

      // if user email exists, check for password match
      const match: boolean = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!match) {
        return next(
          CustomErrorHandler.wrongCredentials(
            "you have entered wrong password!"
          )
        );
      }

      const accessToken = JwtService.signToken({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        gender: user.gender,
      });

      res.json({ accessToken });
    } catch (error) {
      return next(error);
    }
  },
};

export default loginController;
