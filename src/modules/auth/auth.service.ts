import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";

const signupUser = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payload;
  const checkPass = password as string;
  const checkEmail = email as string;
  if (!checkEmail.toLowerCase()) {
    throw new Error("Email must be lowercase");
  }
  if (checkPass.length < 6) {
    throw new Error("Password length must be 6 character");
  }
  const hashedPass = await bcrypt.hash(password as string, 10);
  const result = await pool.query(
    `INSERT INTO users(name, email, password, phone, role) VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [name, email, hashedPass, phone, role]
  );
  delete result.rows[0].password;
  return result.rows[0];
};

const signinUser = async (payload: Record<string, unknown>) => {
  const { email, password } = payload;
  const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);

  if (!result.rows[0]) {
    return "User not found";
  }

  const user = result.rows[0];

  const matchPass = bcrypt.compare(user.password, password as string);

  if (!matchPass) {
    return "Invalid password";
  }

  delete user.password;

  const token = jwt.sign(user, config.jwt_secret as string, {
    expiresIn: "7d",
  });

  return { token, user };
};

export const authServices = {
  signupUser,
  signinUser,
};
