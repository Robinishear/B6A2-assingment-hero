import { Request, Response } from "express";
import { authServices } from "./auth.service";

const signupUser = async (req: Request, res: Response) => {
  try {
    const result = await authServices.signupUser(req.body);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const signinUser = async (req: Request, res: Response) => {
  try {
    const result = await authServices.signinUser(req.body);
    res
      .status(200)
      .json({ success: true, message: "Login successfully", data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const authControllers = {
  signupUser,
  signinUser,
};
