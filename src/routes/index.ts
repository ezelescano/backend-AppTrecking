import { Router } from "express";
import userRouter from "./userRoutes";

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

router.use("/users", userRouter);

export default router;
