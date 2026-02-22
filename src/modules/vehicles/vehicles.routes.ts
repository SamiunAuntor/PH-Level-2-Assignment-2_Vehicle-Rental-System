import { Router } from "express";
import { vehicleController } from "./vehicles.controller";
import { authMiddleware } from "../../middlewares/auth";

const router = Router();

router.post("/", authMiddleware.auth("admin"), vehicleController.createVehicle);

router.get("/", vehicleController.getAllVehicles);

router.get("/:id", vehicleController.getVehicleById);

router.put("/:id", authMiddleware.auth("admin"), vehicleController.updateVehicle);

router.delete("/:id", authMiddleware.auth("admin"), vehicleController.deleteVehicle);

export const vehiclesRoutes = router;