import { NextFunction, Request, Response } from "express";
import { supabase } from "../config/supabase";

export const authenticateUser = async(
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accesToken = req.headers.authorization?.split(" ")[1];
    if (!accesToken) return res.status(401).json({ error: "Unauthorized: Missing token" });

   const {data: userData, error: userError} = await supabase.auth.getUser(accesToken);
   if(userError || !userData.user) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
   }
   (req as any).user = userData.user;
   next();
   } catch (error: any) {
    const statusCode = error.status || 500;
    const message = error.message || "Internal Server Error";
    return res.status(statusCode).json({ message });
  }
};
