import { Router } from "express";
import { vehicleControllers } from "./vehicles.controller";
import auth from "../../middleware/auth";

const router = Router();

// create vehicle admin only
router.post("/", auth("admin"), vehicleControllers.createVehicle);

// get all vehicles
router.get("/", vehicleControllers.getAllVehicles);

// get single vehicle
router.get("/:vehicleId", vehicleControllers.getSingleVehicle);

// update vehicle admin only
router.put("/:vehicleId", auth("admin"), vehicleControllers.updateVehicle);

// delete vehicle admin only
router.delete("/:vehicleId", auth("admin"), vehicleControllers.deleteVehicle);

export const vehicleRoutes = router;
