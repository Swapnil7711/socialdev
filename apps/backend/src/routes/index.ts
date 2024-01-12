import express from "express";
import auth from "../middlewares/auth";
import {
  registerController,
  loginController,
  userController,
  postController,
} from "../controllers/";

const router = express.Router();

router.post("/register", registerController.register);
router.post("/login", loginController.login);
router.get("/profile", auth, userController.profile);
router.post("/post", auth, postController.createPost);
router.get("/post", auth, postController.getAllPosts);
router.put("/post/:postId", auth, postController.updatePost);
router.delete("/post/:postId", auth, postController.deletePost);
router.post("/like-post/:postId", auth, postController.likePost);
router.post("/comment/:postId", auth, postController.postComment);

export default router;
