import { Request, Response } from "express";
import { userServices } from "./users.service";
import { JwtPayload } from "jsonwebtoken";

// getAllUsers admin only
const getAllUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getAllUser();
    if (result.length === 0) {
      return res
        .status(200)
        .json({ success: true, message: "No user found", data: [] });
    }

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, message: error.message, error: error });
  }
};

// update user admin, customer
const updateUser = async (req: Request, res: Response) => {
  try {
    console.log(req.user);
    const result = await userServices.updateUser(
      req.body,
      req.user as JwtPayload,
      req.params.userId!
    );

    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, message: error.message, error: error });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.deleteUser(
      req.params.userId!
    );
    if (result == null) {
      return res.status(200).json({
        success: false,
        message: "User booking status active can not delete",
      });
    }

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, message: error.message, error: error });
  }
};

export const userControllers = {
  getAllUser,
  updateUser,
  deleteUser
};
