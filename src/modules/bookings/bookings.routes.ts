import { Router } from "express";
import { bookingControllers } from "./booking.controller";
import auth from "../../middleware/auth";

const router = Router();

// create booking route
router.post("/", auth("admin", "customer"), bookingControllers.createBooking);

// get all bookings admin, customer;
router.get("/", auth("admin", "customer"), bookingControllers.getAllBookings);

//update booking
router.put("/:bookingId", auth("admin", "customer"), bookingControllers.updateBooking);


export const bookingRoutes = router;