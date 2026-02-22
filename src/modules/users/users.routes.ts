import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth";
import { usersController } from "./users.controller";

const router = Router();

router.get(
    "/",
    authMiddleware.auth("admin"),
    usersController.getAllUsers
);

router.put(
    "/:id",
    authMiddleware.auth(),
    usersController.updateUser
);

router.delete(
    "/:id",
    authMiddleware.auth("admin"),
    usersController.deleteUser
);

export const usersRoutes = router;