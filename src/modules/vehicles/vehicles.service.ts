import { pool } from "../../config/db";

// create vehicles admin only
const createVehicle = async (payload: Record<string, unknown>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;
  const checkPositive = daily_rent_price as number;
  if (checkPositive < 0) {
    throw new Error("Price must be positive");
  }
  const result = await pool.query(
    `INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );
  return result.rows[0];
};

// get all vehicles
const getAllVehicles = async () => {
  const result = await pool.query(`SELECT * FROM vehicles`);
  return result.rows;
};

// get single vehicle
const getSingleVehicle = async (id: string) => {
  const result = await pool.query(`SELECT * FROM vehicles WHERE id= $1`, [id]);
  return result.rows[0];
};

// update vehicle admin only
const updateVehicle = async (payload: Record<string, unknown>, id: string) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;
  const result = await pool.query(
    `UPDATE vehicles SET vehicle_name= COALESCE($1, vehicle_name), type= COALESCE($2, type), registration_number= COALESCE($3, registration_number), daily_rent_price= COALESCE($4, daily_rent_price), availability_status= COALESCE($5, availability_status) WHERE id=$6 RETURNING *`,
    [
      vehicle_name ?? null,
      type ?? null,
      registration_number ?? null,
      daily_rent_price ?? null,
      availability_status ?? null,
      id,
    ]
  );

  return result.rows[0];
};

// delete vehicle admin only;
const deleteVehicle = async (id: string) => {
  const bookings = await pool.query(
    `SELECT * FROM bookings WHERE vehicle_id=$1`,
    [id]
  );

  const booking = bookings.rows[0];

  if (booking && (booking.status as string) === "active") {
    return null;
  }
  const result = await pool.query(`DELETE FROM vehicles WHERE id=$1`, [id]);
  return result;
};

export const vehicleServices = {
  createVehicle,
  getAllVehicles,
  getSingleVehicle,
  updateVehicle,
  deleteVehicle,
};
