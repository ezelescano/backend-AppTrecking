import { getUsers, getUserById } from "../services/usersServices";
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
// export const createUserController = async (req: Request, res: Response) => {
//   const newUser = await createUser();
//   res.status(201).json(newUser);
// };

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

// export const updateUserController = async (req: Request, res: Response) => {
//   const userId = parseInt(req.params.id, 10);
//   const userData = req.body;
//   const updatedUser = await updateUser(userId, userData);
//   res.json(updatedUser);
// };

// export const deleteUserController = async (req: Request, res: Response) => {
//   const userId = parseInt(req.params.id, 10);
//   const deletedUser = await deleteUser(userId);
//   res.json(deletedUser);
// }
