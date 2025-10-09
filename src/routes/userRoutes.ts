import { Router } from "express";
import {
  getUsersController,
  getUserByIdController,
} from "../controllers/usersControllers";

const userRouter: Router = Router();

userRouter.get("/", getUsersController);
userRouter.get("/:id", getUserByIdController);
// userRouter.post("/", createUserController);
// userRouter.put("/:id", updateUserController);
// userRouter.delete("/:id", deleteUserController);

export default userRouter;
