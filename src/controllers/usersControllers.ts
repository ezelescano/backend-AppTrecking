
import { Request, Response } from "express";
import { getUserWhithProfile } from "../services/usersServices";

export const getUsersController = async (req: Request, res: Response) => {
 try {
  const userId = req.params.id

  if(!userId || userId.trim() === "") {
    return res.status(400).json({message: "User ID cannot be empty"});
  }

  const user = await getUserWhithProfile(userId);
  if(!user) {
    return res.status(404).json({message: "User not found"});
  }

  return res.status(200).json({user});

 } catch (error : any) {
  const statusCode = error.status || 500;
  const message = error.message || "Internal server error";
  return res.status(statusCode).json({message});
 }
};


