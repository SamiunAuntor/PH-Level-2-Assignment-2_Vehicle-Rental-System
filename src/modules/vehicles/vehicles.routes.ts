import { Router } from "express";
import { vehicleController } from "./vehicles.controller";
import { authMiddleware } from "../../middlewares/auth";

const router = Router();

// create a new vehicle (admin only)
router.post("/", authMiddleware.auth("admin"), vehicleController.createVehicle);

// get all vehicles (public)
router.get("/", vehicleController.getAllVehicles);

// get a specific vehicle by ID (public)
router.get("/:id", vehicleController.getVehicleById);

// update a vehicle (admin only) 
router.put("/:id", authMiddleware.auth("admin"), vehicleController.updateVehicle);

export const vehiclesRoutes = router;


