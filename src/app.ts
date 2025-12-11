import express, { Request, Response } from "express";
import initDB from "./config/db";
import { authRoutes } from "./modules/auth/auth.routes";
import { vehicleRoutes } from "./modules/vehicles/vehicles.routes";
import { userRoutes } from "./modules/users/users.routes";
import { bookingRoutes } from "./modules/bookings/bookings.routes";

("./config/db");

const app = express();

app.use(express.json());

initDB();

//auth routes
app.use("/api/v1/auth", authRoutes);

//users route
app.use("/api/v1/users", userRoutes);

// vehicle routes
app.use("/api/v1/vehicles", vehicleRoutes);

//booking routes
app.use("/api/v1/bookings", bookingRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Express server is running");
});

export default app;