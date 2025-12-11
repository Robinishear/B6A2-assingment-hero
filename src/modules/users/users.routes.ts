import { Router } from "express";
import { userControllers } from "./users.controller";
import auth from "../../middleware/auth";

const router = Router();

// get all users admin only
router.get("/", auth("admin"), userControllers.getAllUser);

// update user profile admin , customer
router.put("/:userId", auth("admin", "customer"), userControllers.updateUser);

// delete user admin only
router.delete("/:userId", auth("admin"), userControllers.deleteUser);

export const userRoutes = router;
