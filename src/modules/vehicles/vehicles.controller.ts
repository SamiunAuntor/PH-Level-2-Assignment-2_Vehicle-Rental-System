import { Request, Response } from "express";
import { vehiclesServices } from "./vehicles.services";

const createVehicle = async (req: Request, res: Response) => {
    try {
        const vehicleData = req.body;
        const result = await vehiclesServices.createVehicle(vehicleData);

        res.status(201).json({
            success: true,
            message: "Vehicle created successfully",
            data: result,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const getAllVehicles = async (req: Request, res: Response) => {
    try {
        const vehicles = await vehiclesServices.getAllVehicles();

        res.status(200).json({
            success: true,
            message: vehicles.length
                ? "Vehicles retrieved successfully"
                : "No vehicles found",
            data: vehicles,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Error retrieving vehicles",
            errors: error.message,
        });
    }
};

const getVehicleById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const vehicle = await vehiclesServices.getVehicleById(id);

        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Vehicle retrieved successfully",
            data: vehicle,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Error retrieving vehicle",
            errors: error.message,
        });
    }
};

const updateVehicle = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const payload = req.body;

        if (Object.keys(payload).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No fields to update",
            });
        }

        const updatedVehicle = await vehiclesServices.updateVehicle(id, payload);

        res.status(200).json({
            success: true,
            message: "Vehicle updated successfully",
            data: updatedVehicle,
        });
    } catch (error: any) {
        if (error.message === "Vehicle not found") {
            return res.status(404).json({
                success: false,
                message: error.message,
            });
        }
        res.status(400).json({
            success: false,
            message: "Vehicle update failed",
            errors: error.message,
        });
    }
};

const deleteVehicle = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        await vehiclesServices.deleteVehicle(id);

        res.status(200).json({
            success: true,
            message: "Vehicle deleted successfully",
        });
    } catch (error: any) {
        if (error.message === "Vehicle not found") {
            return res.status(404).json({
                success: false,
                message: error.message,
            });
        }

        if (error.message === "Cannot delete vehicle with active bookings") {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }

        res.status(500).json({
            success: false,
            message: "Vehicle deletion failed",
            errors: error.message,
        });
    }
};

export const vehicleController = {
    createVehicle,
    getAllVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle,
};