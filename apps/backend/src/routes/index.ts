import express from "express";
import auth from "../middlewares/auth";
import {
  registerController,
  loginController,
  userController,
} from "../controllers/";

const router = express.Router();

router.post("/register", registerController.register);
router.post("/login", loginController.login);
router.get("/profile", auth, userController.profile);

export default router;
