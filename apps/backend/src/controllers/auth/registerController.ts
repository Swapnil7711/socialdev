import { Request, Response, NextFunction } from "express";
import { registerSchema } from "common";
import { fromZodError } from "zod-validation-error";
import CustomErrorHandler from "../../services/CustomErrorHandler";
import prisma from "../../utils/prismaClient";
import bcrypt from "bcryptjs";
import JwtService from "../../services/JwtService";
import { UserType } from "@socialdev/types/AppTypes";

const registerController = {
  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    // validate the request with zod or joi
    const result = registerSchema.safeParse(req.body);
    if (!result.success) {
      const validationError = fromZodError(result.error);
      return next(validationError);
    }

    // check if user is already in the database

    try {
      const alreadyExists: UserType | null = await prisma.user.findUnique({
        where: {
          email: req.body.email,
        },
      });

      if (alreadyExists) {
        return next(CustomErrorHandler.alreadyExists("User already exists"));
      }
    } catch (error) {
      return next(error);
    }
    // hash the password with bcrypt
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword: string = bcrypt.hashSync(req.body.password, salt);

    // IF user creation is successful
    let accessToken: string | undefined;
    try {
      const newUser: UserType = await prisma.user.create({
        data: {
          email: req.body.email,
          password: hashedPassword,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          gender: req.body.gender,
        },
      });
      // generate jwt token
      accessToken = JwtService.signToken({
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        gender: newUser.gender,
      });
    } catch (error) {
      console.log(error);
      return next(error);
    }
    // send response
    console.log(accessToken);

    res.json({ accessToken });
  },
};

export default registerController;
