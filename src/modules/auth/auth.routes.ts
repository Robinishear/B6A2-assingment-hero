import { Router } from "express";
import { authControllers } from "./auth.controller";

const router = Router();

// signup routes
router.post("/signup", authControllers.signupUser);

// signin routes
router.post("/signin", authControllers.signinUser);

export const authRoutes = router;
