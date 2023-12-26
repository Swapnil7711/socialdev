import express from "express";
import { registerController } from "../controllers/";
import { loginController } from "../controllers/";

const router = express.Router();

router.post("/register", registerController.register);
router.post("/login", loginController.login);

export default router;
