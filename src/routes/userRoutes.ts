import { Router } from "express";
import {
  getUsersController
} from "../controllers/usersControllers";
import { authenticateUser } from "../middelwares/authenticates";

const userRouter: Router = Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Obtener el per
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
userRouter.get("/", authenticateUser, getUsersController);

export default userRouter;

