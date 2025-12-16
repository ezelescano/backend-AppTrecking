import { Router } from "express";
import { authenticateUser } from "../middelwares/authenticates";
import { followUserController, getFollowersController, unfollowUserController } from "../controllers/followController";

const followRouter: Router = Router();

followRouter.post("/:id", authenticateUser, followUserController);

followRouter.delete("/:id", authenticateUser, unfollowUserController);

followRouter.get("/followers", authenticateUser, getFollowersController)

export default followRouter;