import { Router } from "express";
import { vehicleController } from "./vehicles.controller";
import { authMiddleware } from "../../middlewares/auth";

const router = Router();

router.post("/", authMiddleware.auth("admin"), vehicleController.createVehicle);
router.get("/", vehicleController.getAllVehicles);

export const vehiclesRoutes = router;


