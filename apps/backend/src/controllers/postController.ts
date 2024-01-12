import { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import CustomErrorHandler from "../services/CustomErrorHandler";
import { postSchema } from "common";
import { ValidationError, fromZodError } from "zod-validation-error";
import fs from "fs";
import { appRoot } from "../../appRoot";
import prisma from "../utils/prismaClient";
import {
  CommentTypes,
  LikeTypes,
  PostTypes,
  UserType,
} from "@socialdev/types/AppTypes";

// Extend the Request type to include the 'user' property
interface CustomRequest extends Request {
  user?: string; // Replace 'string' with the actual type of your user ID
}

const storage: multer.StorageEngine = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    cb(null, "uploads/");
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    const originalExtension = path.extname(file.originalname); // Get the original file extension
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + originalExtension);
  },
});

const upload = multer({ storage, limits: { fileSize: 1000000 * 5 } }).single(
  "image"
);

const postController = {
  async createPost(req: CustomRequest, res: Response, next: NextFunction) {
    // first implement multer to handle image upload
    // store image in upload folder.
    // if req.body schema validation fails, remove image from upoad folder.
    // else store the image url and req.body params in db.
    // send response.
    // let filepath: string | undefined;
    upload(req, res, async (err) => {
      if (err) {
        return next(CustomErrorHandler.serverError("something went wrong"));
      }
      //   parese the req.body with zod
      let filepath: string | undefined = req.file && req.file.path;

      const { content, image } = req.body;

      const result = postSchema.safeParse({
        content,
        image,
      });
      if (!result.success) {
        // filepath = req.file?.path!;
        const fileToDelete: string | undefined = appRoot + "/" + req.file?.path;
        if (fileToDelete !== undefined) {
          fs.unlink(fileToDelete, (err) => {
            if (err) {
              return next(err);
            }
          });
        }
        const validationError: ValidationError = fromZodError(result.error);
        return next(validationError);
      }
      // if no error store data in Db
      const userId: number =
        typeof req.user === "number" ? req.user : parseInt(req.user!);

      try {
        const createdPost: PostTypes = await prisma.post.create({
          data: {
            content: req.body.content,
            image: filepath,
            userId: userId,
          },
        });
        res.json({ post: createdPost });
      } catch (error) {
        return next(CustomErrorHandler.serverError("Database error"));
      }
    });
  },

  async updatePost(req: CustomRequest, res: Response, next: NextFunction) {
    // get the postid from param
    // get the userid from token
    // only allow user to update its own post.
    const postId: number = parseInt(req.params.postId);
    const userId: string | undefined = req.user;

    // extract post from database
    // check if image is also updated by chacking if imageurl mactches oldpost url. if yes then just upadte the content else update the image as well
    upload(req, res, async (err) => {
      if (err) {
        return next(CustomErrorHandler.serverError("something went wrong"));
      }
      //   parese the req.body with zod

      const { content } = req.body;

      const result = postSchema.safeParse({
        content,
      });
      if (!result.success) {
        const validationError: ValidationError = fromZodError(result.error);
        return next(validationError);
      }
      // if no error store data in Db
      const userId: number =
        typeof req.user === "number" ? req.user : parseInt(req.user!);
      try {
        const oldPost: Partial<PostTypes> | null = await prisma.post.findUnique(
          {
            where: {
              id: postId,
            },
            select: {
              id: true,
              content: true,
              userId: true,
            },
          }
        );
        // const parsedFilePath: string = req.body.image.spit("src/")[1];
        if (oldPost?.userId !== userId || oldPost?.id !== postId) {
          return next(
            CustomErrorHandler.unAuthorised(
              "you are not authorised to update this post"
            )
          );
        }
        const updatedPost = await prisma.post.update({
          where: {
            id: oldPost?.id,
          },
          data: {
            content: req.body.content,
          },
        });
        res.json({ updatedPost: updatedPost });
      } catch (error) {
        return next(error);
      }
    });

    // ..............................
  },

  async getAllPosts(req: CustomRequest, res: Response, next: NextFunction) {
    const allPosts = await prisma.post.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        likes: true,
        comments: true,
      },
    });

    res.json({ posts: allPosts });
  },
  async deletePost(req: CustomRequest, res: Response, next: NextFunction) {
    const postId = parseInt(req.params.postId);
    const userId: number =
      typeof req.user === "number" ? req.user : parseInt(req.user!);
    console.log(`postid ${postId} userId ${userId}`);
    try {
      const oldPost: Partial<PostTypes> | null = await prisma.post.findUnique({
        where: {
          id: postId,
        },
        select: {
          id: true,
          content: true,
          userId: true,
        },
      });
      console.log(oldPost);
      if (oldPost?.userId !== userId || oldPost?.id !== postId) {
        return next(
          CustomErrorHandler.unAuthorised(
            "you are not authorised to Delete this post"
          )
        );
      }
      const result = await prisma.post.delete({
        where: {
          id: postId,
        },
      });
      res.json({ deleted: result });
    } catch (error) {
      return next(error);
    }
  },

  async likePost(req: CustomRequest, res: Response, next: NextFunction) {
    const userId: number =
      typeof req.user === "number" ? req.user : parseInt(req.user!);
    const postId: number = parseInt(req.params.postId);

    try {
      const result: LikeTypes = await prisma.like.create({
        data: {
          userId: userId,
          postId: postId,
        },
      });

      res.json({ result: result });
    } catch (error) {
      return next(error);
    }
  },

  async postComment(req: CustomRequest, res: Response, next: NextFunction) {
    const userId: number =
      typeof req.user === "number" ? req.user : parseInt(req.user!);
    const postId: number = parseInt(req.params.postId);

    try {
      const result: CommentTypes = await prisma.comment.create({
        data: {
          content: req.body.content,
          userId: userId,
          postId: postId,
        },
      });

      res.json({ result: result });
    } catch (error) {
      return next(error);
    }
  },
};

export default postController;
