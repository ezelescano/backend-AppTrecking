import { Request, Response } from "express";

export const authenticateUser = (req: Request, res: Response, next: Function) => {
   try {
     const accesToken = req.headers.authorization?.split(" ")[1];
    if (!accesToken) return res.status(401).json({ error: "Unauthorized" });
    
    next();
   } catch (error) {
    
   }
};
