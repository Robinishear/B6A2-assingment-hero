import { pool } from "../../config/db";

// getAllUser admin only
const getAllUser = async () => {
  const result = await pool.query(
    `SELECT id, name, email, phone, role FROM users`
  );
  return result.rows;
};

// update user admin, customer
const updateUser = async (
  body: Record<string, unknown>,
  payload: Record<string, unknown>,
  id: string
) => {
  const { name, email, phone, role } = body;
  // console.log(payload);

  if (payload.role === "admin") {
    const result = await pool.query(
      `UPDATE users SET name=COALESCE($1, name), email= COALESCE($2, email), phone= COALESCE($3, phone), role= COALESCE($4, role) WHERE id=$5 RETURNING *`,
      [name ?? null, email ?? null, phone ?? null, role ?? null, id]
    );
    delete result.rows[0].password;
    return result.rows[0];
  } else if (payload.role === "customer" && payload.id == id) {
    const result = await pool.query(
      `UPDATE users SET name= COALESCE($1, name), email= COALESCE($2, email), phone= COALESCE($3, phone) WHERE id=$4 RETURNING *`,
      [name ?? null, email ?? null, phone ?? null, id]
    );
    delete result.rows[0].password;
    return result.rows[0];
  }
};

// delete user admin only
const deleteUser = async (id: string) => {
    const bookings = await pool.query(
    `SELECT * FROM bookings WHERE customer_id=$1`,
    [id]
  );

    const booking = bookings.rows[0];

  if (booking && (booking.status as string) === "active") {
    return null;
  }
  const result = await pool.query(`DELETE FROM users WHERE id=$1`, [id]);
  return result;
}

export const userServices = {
  getAllUser,
  updateUser,
  deleteUser
};
