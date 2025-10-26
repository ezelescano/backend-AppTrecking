import {
  getUsers,
  getUserById,
  deleteUser,
  createUser,
  updateUser
} from "../services/usersServices";
import { Request, Response } from "express";

export const getUsersController = async (req: Request, res: Response) => {
  try {
    const users = await getUsers();
    if (!users) {
      return res.status(404).json({ message: "No users found" });
    }
    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getUsersController:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const createUserController = async (req: Request, res: Response) => {
  try {
    const newUser = await createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error in createUserController:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserByIdController = async (req: Request, res: Response) => {
  try {
    const user = await getUserById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    if (error instanceof Error && error.name === "NotFoundError") {
      return res.status(404).json({ message: error.message });
    }

    console.error("Error in getUserByIdController:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUserController = async (req: Request, res: Response) => {
  try {
    const updatedUser = req.params.id;
    const userData = req.body;

    const user = await updateUser(updatedUser, userData);
    res.status(200).json(user);
  } catch (error) {
    console.error("Error in updateUserController:", error);
    res.status(500).json({ message: "Internal server error" }); 
  }
};

export const deleteUserController = async (req: Request, res: Response) => {
  try {
    const result = await deleteUser(req.params.id);

    if (result === "User deleted successfully") {
      res.status(200).send({ message: "User deleted successfully" });
    } else {
      res.status(404).send({ message: result });
    }
  } catch (error) {
    console.error("Error in deleteUserController:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
