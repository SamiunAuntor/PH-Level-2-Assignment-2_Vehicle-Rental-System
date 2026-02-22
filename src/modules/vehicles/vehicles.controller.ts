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

        if (vehicles.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No vehicles found",
                data: [],
            });
        }

        res.status(200).json({
            success: true,
            message: "Vehicles retrieved successfully",
            data: vehicles,
        });
    }
    catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getVehicleById = async (req: Request, res: Response) => {
    try {
        const result = await vehiclesServices.getVehicleById(parseInt(req.params.id));

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Vehicle retrieved successfully",
            data: result,
        });
    }
    catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const updateVehicle = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const payload = req.body;

        const result = await vehiclesServices.updateVehicle(parseInt(id), payload);

        res.status(200).json({
            success: true,
            message: "Vehicle updated successfully",
            data: result,
        });

    }
    catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const deleteVehicle = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Vehicle ID is required",
                error: "Vehicle ID is required",
            });
        }

        const result = await vehiclesServices.deleteVehicle(parseInt(id));

        res.status(200).json({
            success: true,
            message: "Vehicle deleted successfully",
        });

    }
    catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message,
            error: error,
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