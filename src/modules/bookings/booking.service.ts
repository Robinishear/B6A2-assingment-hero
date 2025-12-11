import { pool } from "../../config/db";

// create booking admin , customer;
const createBooking = async (payload: Record<string, unknown>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;
  const endDate = new Date(rent_start_date as string);
  const startDate = new Date(rent_start_date as string);
  let total_price;
  if (
    startDate.getDate() === endDate.getDate() &&
    endDate.getDate() < startDate.getDate()
  ) {
    throw new Error("Must be after start date");
  }
  if (total_price! < 0) {
    throw new Error("Must be positive");
  }
  const result = await pool.query(
    `INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
    [
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      total_price,
      "active",
    ]
  );

  const vehicleId = result.rows[0].vehicle_id;
  const start = new Date(rent_start_date as string);
  const end = new Date(rent_end_date as string);

  const number_of_days: number = Math.floor(
    (end.getTime() - start.getTime()) / 86400000
  );

  const vehicle = await pool.query(
    `UPDATE vehicles SET availability_status=$1 WHERE id=$2 RETURNING vehicle_name, daily_rent_price`,
    ["booked", vehicleId]
  );

  total_price = vehicle.rows[0].daily_rent_price * number_of_days;
  if (total_price < 0) {
    throw new Error("Must be positive");
  }
  const id = result.rows[0].id;
  const updateBookings = await pool.query(
    `UPDATE bookings SET total_price=$1 WHERE id=$2 RETURNING *`,
    [total_price, id]
  );

  const data = {
    ...updateBookings.rows[0],
    vehicle: vehicle.rows[0],
  };
  return data;
};

// update booking
const updateBooking = async (
  status: string,
  id: string,
  user: Record<string, unknown>
) => {
  const booking = await pool.query(`SELECT * FROM bookings WHERE id=$1`, [id]);

  const bookings = booking.rows[0];

  const today = new Date();
  const startDate = new Date(bookings.rent_start_date);
  const endDate = new Date(bookings.rent_end_date);

  if (
    user.role === "customer" &&
    status === "cancelled" &&
    startDate.getTime() > today.getTime() &&
    startDate.getTime() != today.getTime()
  ) {
    await pool.query(
      `UPDATE vehicles SET availability_status=$1 WHERE id=$2 RETURNING *`,
      ["available", bookings.vehicle_id]
    );
    const updateBookings = await pool.query(
      `UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`,
      ["cancelled", id]
    );
    return {
      success: true,
      message: "Booking cancelled successfully",
      data: updateBookings.rows[0],
    };
  }

  if (user.role === "admin" && status === "returned") {
    const updateVehicle = await pool.query(
      `UPDATE vehicles SET availability_status=$1 WHERE id=$2 RETURNING availability_status`,
      ["available", bookings.vehicle_id]
    );
    const updateBookings = await pool.query(
      `UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`,
      ["returned", id]
    );
    return {
      success: true,
      message: "Booking marked as returned. Vehicle is now available",
      data: { ...updateBookings.rows[0], vehicle: updateVehicle.rows[0] },
    };
  }

  if (today.getTime() > endDate.getTime()) {
    const updateVehicle = await pool.query(
      `UPDATE vehicles SET availability_status=$1 WHERE id=$2 RETURNING availability_status`,
      ["available", bookings.vehicle_id]
    );
    const updateBookings = await pool.query(
      `UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`,
      ["returned", id]
    );
    return {
      success: true,
      message: "Booking marked as returned. Vehicle is now available",
      data: { ...updateBookings.rows[0], vehicle: updateVehicle.rows[0] },
    };
  }
};

// get all bookings admin, customer;
const getAllBookings = async (user: Record<string, unknown>) => {
  if (user.role === "admin") {
    const allBookings = await pool.query(`SELECT * FROM bookings`);
    const result = await Promise.all(
      allBookings.rows.map(async (item) => {
        const user = await pool.query(
          `SELECT name, email FROM users WHERE id=$1`,
          [item.customer_id]
        );

        const vehicle = await pool.query(
          `SELECT vehicle_name, registration_number FROM vehicles WHERE id=$1`,
          [item.vehicle_id]
        );
        return { ...item, user: user.rows[0], vehicle: vehicle.rows[0] };
      })
    );
    return {
      success: true,
      message: "Bookings retrieved successfully",
      data: result,
    };
  } else if (user.role === "customer") {
    console.log("customer");
    const customer_id = user.id!;
    const allBookings = await pool.query(
      `SELECT id, vehicle_id, rent_start_date, rent_end_date, total_price, status FROM bookings WHERE id=$1`,
      [customer_id]
    );
    const result = await Promise.all(
      allBookings.rows.map(async (item) => {
        const vehicle = await pool.query(
          `SELECT vehicle_name, registration_number, type FROM vehicles WHERE id=$1`,
          [item.vehicle_id]
        );
        return { ...item, vehicle: vehicle.rows[0] };
      })
    );
    console.log(result);
    return {
      success: true,
      message: "Your bookings retrieved successfully",
      data: result,
    };
  }
};

export const bookingServices = {
  createBooking,
  updateBooking,
  getAllBookings,
};
