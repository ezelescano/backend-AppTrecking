import { Router } from "express";
import userRouter from "./userRoutes";
import postRouter from "./postRoutes";
import authRouter from "./authRoutes";
const router = Router();

/**
 * @swagger
 * /test-db:
 *   get:
 *     summary: Test Supabase connection
 *     tags: [Test]
 *     responses:
 *       200:
 *         description: Datos de Usuarios (limit 5)
 */

router.use("/auth", authRouter);
router.use("/perfil", userRouter);
router.use("/posts", postRouter);

export default router;
