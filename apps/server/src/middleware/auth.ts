import prisma from "@/db";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authToken = req.cookies.auth_token;
      if (!authToken) {
        return res
          .status(401)
          .json({ message: "Authentication token missing" });
      }

      const decoded = jwt.verify(authToken, process.env.JWT_KEY as string);
      if (typeof decoded === "string") {
        return res.status(401).json({ message: "Invalid token format" });
      }

      const { email } = decoded;

      const user = await prisma.user.findUnique({
        where: { email },
        select: { email: true, id: true },
      });

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = user;

      next();
    } catch (error) {
      console.error("Authentication error:", error);
      return res.status(401).json({ message: "Unauthorized" });
    }
};