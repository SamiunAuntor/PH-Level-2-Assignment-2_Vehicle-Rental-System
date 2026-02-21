import { Request, Response, Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

router.post('/signup', authController.signupUser);

export const authRoutes = router;