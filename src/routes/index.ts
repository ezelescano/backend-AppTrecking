import { Router } from "express";
import userRouter from "./userRoutes";
import postRouter from "./postRoutes";
import authRouter from "./authRoutes";
import followRouter from "./followsRoutes";
const router = Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/posts", postRouter);
router.use("/follow", followRouter)

export default router;
