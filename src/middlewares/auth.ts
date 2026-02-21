import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "..//config";

const auth = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }

            const token = authHeader.split(' ')[1];

            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: "No token provided",
                });
            }   

            const decoded = jwt.verify(
                token,
                config.jwt_secret as string
            ) as JwtPayload;

            (req as any).user = decoded;

            if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden",
                });
            }

            next();
        }
        catch (error) {
            return res.status(401).json({
                success: false,
                message: "Invalid token",
            });
        }  
    };
}