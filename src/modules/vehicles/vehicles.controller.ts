import { Request, Response } from "express";
import { vehicleServices } from "./vehicles.service";

// create vehicle admin only
const createVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.createVehicle(req.body);

    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// get all vehicles
const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.getAllVehicles();

    if (result.length === 0) {
      return res
        .status(200)
        .json({ success: true, message: "No vehicles found", data: [] });
    }

    res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// get single vehicle
const getSingleVehicle = async (req: Request, res: Response) => {
  try {
    const id = req.params.vehicleId;
    const result = await vehicleServices.getSingleVehicle(id!);
    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Vehicle not found" });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// update vehicle admin only
const updateVehicle = async (req: Request, res: Response) => {
  try {
    const id = req.params.vehicleId;
    const result = await vehicleServices.updateVehicle(req.body, id!);

    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Vehicle not found" });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// delete vehicle admin only
const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.deleteVehicle(
      req.params.vehicleId as string
    );
    if (result == null) {
      return res.status(200).json({
        success: false,
        message: "vehicle booking status active can not delete",
      });
    }

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Vehicle not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Vehicle deleted successfully" });
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, message: error.message, error: error });
  }
};

export const vehicleControllers = {
  createVehicle,
  getAllVehicles,
  getSingleVehicle,
  updateVehicle,
  deleteVehicle,
};
