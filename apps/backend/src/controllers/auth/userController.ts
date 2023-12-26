import { UserType } from "@socialdev/types/UserTypes";
import { Request, Response, NextFunction } from "express";
import prisma from "../../utils/prismaClient";
import CustomErrorHandler from "../../services/CustomErrorHandler";

const userController = {
  async profile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    // get the user from databse and send its data

    try {
      const user: Partial<UserType> | null = await prisma.user.findUnique({
        where: {
          id: req.body.user.id,
        },
        select: {
          email: true,
          firstName: true,
          lastName: true,
          gender: true,
        },
      });
      if (!user) {
        return next(CustomErrorHandler.notFound("No user found!"));
      }
      res.json({ user });
    } catch (error) {
      return next(Error);
    }
  },
};

export default userController;
