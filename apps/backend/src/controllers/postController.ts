import { Request, Response, NextFunction, Express } from "express";
import multer from "multer";
import path from "path";
import CustomErrorHandler from "../services/CustomErrorHandler";
import { postSchema } from "common";
import { fromZodError } from "zod-validation-error";
import fs from "fs";
import { appRoot } from "../../appRoot";
import prisma from "../utils/prismaClient";
// multer config

const storage = multer.diskStorage({
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
  async createPost(req: Request, res: Response, next: NextFunction) {
    // first implement multer to handle image upload
    // store image in upload folder.
    // if req.body schema validation fails, remove image from upoad folder.
    // else store the image url and req.body params in db.
    // send response.
    // let filepath: string | undefined;
    upload(req, res, async (err) => {
      console.log("req body", req.body);
      if (err) {
        return next(CustomErrorHandler.serverError(err));
      }
      //   parese the req.body with zod
      let filepath = req.file && req.file.path;

      const { content, image } = req.body;

      const post: any = {
        postText: req.body.content,
        postImage: filepath,
        user: req.body.userId,
      };
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
        const validationError = fromZodError(result.error);
        return next(validationError);
      }
      // if no error store data in Db

      console.log(`filepath and userID ${filepath} ${req.body.userId}`);
      // try {
      //   const post = await prisma.post.create(req.body);
      //   console.log("post", post);
      // } catch (error) {
      //   return next(error);
      // }
      res.json({ msg: "hello from post" });
    });
  },
};

export default postController;
