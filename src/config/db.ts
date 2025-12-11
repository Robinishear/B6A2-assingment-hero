import { Pool } from "pg";
import config from ".";

export const pool = new Pool({
  connectionString: config.connection_str,
});
const initDB = async () => {
  await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phone VARCHAR(14) NOT NULL,
        role VARCHAR(50)
        )
        `);

  await pool.query(`
            CREATE TABLE IF NOT EXISTS vehicles(
            id SERIAL PRIMARY KEY,
            vehicle_name VARCHAR(150) NOT NULL,
            type VARCHAR(50),
            registration_number VARCHAR(100) NOT NULL UNIQUE,
            daily_rent_price INT NOT NULL,
            availability_status VARCHAR(50)
            )
            `);

  await pool.query(`
                CREATE TABLE IF NOT EXISTS bookings(
                id SERIAL PRIMARY KEY,
                customer_id INT REFERENCES users(id) ON DELETE CASCADE,
                vehicle_id INT REFERENCES vehicles(id) ON DELETE CASCADE,
                rent_start_date VARCHAR(50) NOT NULL,
                rent_end_date VARCHAR(50) NOT NULL,
                total_price INT NOT NULL,
                status VARCHAR(50)
                )
                `);
};

export default initDB;
