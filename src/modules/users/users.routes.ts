import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth";
import { usersController } from "./users.controller";


const router = Router();


router.get('/', authMiddleware.auth("admin"), usersController.getAllUsers);



export const usersRoutes = router;