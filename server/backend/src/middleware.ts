import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "./config";
import prisma from "./db";
import { z } from "zod";

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"] ?? "";

  if (!authHeader) {
    return res.status(401).json({
      message: "Authorization header missing",
    });
  }

  try {
    const decoded = jwt.verify(authHeader, JWT_SECRET) as JwtPayload;

    if (decoded.userId) {
      req.userId = decoded.userId;
      return next();
    } else {
      return res.status(403).json({
        message: "Invalid token",
      });
    }
  } catch (e) {
    return res.status(403).json({
      message: "Invalid authorization format or token",
    });
  }
}

// Define the schema for address
const addressSchema = z.string();

export const verifyAddressMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //@ts-ignore
    const userId: string = req.userId!;
    const address = addressSchema.parse(req.query.address);

    // Verify that the address belongs to the authenticated user
    const user = await prisma.user.findFirst({
      where: {
        id: Number(userId),
        address: address,
      },
    });

    if (!user) {
      return res.status(403).json({
        message:
          "Unauthorized: Address does not belong to the authenticated user.",
      });
    }

    //@ts-ignore
    req.address = address;
    next();
  } catch (error) {
    return res.status(400).json({
      message: "Address validation failed",
      errors: error,
    });
  }
};
