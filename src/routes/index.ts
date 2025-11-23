import { Router } from "express";
import userRouter from "./userRoutes";
import postRouter from "./postRoutes";
import authRouter from "./authRoutes";
const router = Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/posts", postRouter);

export default router;
