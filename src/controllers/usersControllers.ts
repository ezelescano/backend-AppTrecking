
import { Request, Response } from "express";
import { getUserWhithProfile } from "../services/usersServices";

export const getUsersController = async (req: Request, res: Response) => {
  
  try {
    const userId = (req as any).user.id;

  const user =  await getUserWhithProfile(userId);

  return res.status(200).json(user);
 } catch (error : any) {
  const statusCode = error.status || 500;
  const message = error.message || "Internal server error";
  return res.status(statusCode).json({message});
 }
};


