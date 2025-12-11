import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const auth = (...role: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split("Bearer ")[1];
      if (!token) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }
      const decode = jwt.verify(
        token,
        config.jwt_secret as string
      ) as JwtPayload;
      req.user = decode as JwtPayload;

      if (role.length && !role.includes(decode.role)) {
        return res
          .status(403)
          .json({ success: false, message: "Forbidden access" });
      }
      next();
    } catch (error: any) {
      res
        .status(500)
        .json({ success: false, message: error.message, error: error });
    }
  };
};

export default auth;
