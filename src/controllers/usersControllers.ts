import { Request, Response } from "express";
import {
  completeProfile,
  getUserById,
  getUserWhithProfile,
  updateUserProfile,
} from "../services/usersServices";
import { BadRequest } from "../errors";

export const getUsersController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const user = await getUserWhithProfile(userId);

    return res.status(200).json(user);
  } catch (error: any) {
    const statusCode = error.status || 500;
    const message = error.message || "Internal server error";
    return res.status(statusCode).json({ message });
  }
};

export const updateProfileController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const userUpdate = req.body;

    const updateUser = await updateUserProfile(userId, userUpdate);

    return res.status(200).json(updateUser);
  } catch (error: any) {
    const statusCode = error.status || 500;
    const message = error.message || "Intermal server error";
    return res.status(statusCode).json({ message });
  }
};

export const getUserByIdController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

     if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const findUser = await getUserById(userId);

    return res.status(200).json(findUser);
  } catch (error: any) {
    const statusCode = error.status || 500;
    const message = error.message || "Internal server error";
    return res.status(statusCode).json({ message });
  }
};


export const completeProfController = async (req: Request, res: Response) =>{
  try {
    const {newProfile} = req.body;
    
    const userId = (req as any).user.id;

    const newInsertProfile = await completeProfile(userId, newProfile);
    return res.status(201).json({profile: newInsertProfile}); 
   } catch (error : any) {
    const statusCode = error.status || 500;
    const message = error.message || "Internal server error";
    res.status(statusCode).json({message});
  }
}