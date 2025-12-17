import { Router } from "express";
import { authenticateUser } from "../middelwares/authenticates";
import {
  followUserController,
  getFollowersController,
  getFollowingController,
  unfollowUserController,
} from "../controllers/followController";

const followRouter: Router = Router();

followRouter.post("/:id", authenticateUser, followUserController);

followRouter.delete("/:id", authenticateUser, unfollowUserController);

followRouter.get("/followers", authenticateUser, getFollowersController);

followRouter.get("/following", authenticateUser, getFollowingController);

export default followRouter;
