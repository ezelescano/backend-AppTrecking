import { NextFunction, Request, Response } from "express";
import { supabase } from "../config/supabase";

interface AuthenticatedRequest  extends Request {
  user?: any;
}

export const authenticateUser = async(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
try {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Invalid authorization format" });
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
  req.user = data.user;
  
  next();
} catch (error : any) {
  const statusCode = error.status || 500;
  const message = error.message || "Internal server error";

  return res.status(statusCode).json({message});
   
}
};
