import { Request, Response, NextFunction } from "express";
import { registerSchema } from "common";
import { fromZodError } from "zod-validation-error";
import CustomErrorHandler from "../../services/CustomErrorHandler";
import prisma from "../../utils/prismaClient";
import { User } from "database";
import bcrypt from "bcrypt";
import JwtService from "../../services/JwtService";

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

    // authorise the request

    // check if user is already in the database

    try {
      const alreadyExists: User | null = await prisma.user.findUnique({
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
    const hashedPassword: string = await bcrypt.hash(req.body.password, 10);
    console.log("hashedpassword", hashedPassword);
    // store ion database with prisma
    // IF user creation is successful
    let accessToken: string | undefined;
    try {
      const newUser: User = await prisma.user.create({
        data: {
          email: req.body.email,
          password: hashedPassword,
          firstName: req.body.firstName,
          lastname: req.body.lastName,
          gender: req.body.gender,
        },
      });

      // generate jwt token
      accessToken = JwtService.signToken({
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastname: newUser.lastname,
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
