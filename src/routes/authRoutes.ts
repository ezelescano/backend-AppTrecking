import { Router } from "express";
import { register, login,  logout, me } from "../controllers/authController";

const authRouter: Router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Auth:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           format: password
 *       required:
 *         - email
 *         - password
 */

authRouter.post("/register", register);

/** * @swagger
 * /auth/login:
 *   post:
 *     summary: Inicia sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Auth'
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *       401:
 *         description: Credenciales inválidas
 */

authRouter.post("/login", login);

/** * @swagger
 * /auth/logout:
 *   post:              
 *     summary: Cierra sesión
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Cierre de sesión exitoso
 *       401:
 *         description: No autorizado
 */

authRouter.post("/logout", logout);

/** * @swagger
 * /auth/me:
 *   get:
 *     summary: Obtiene información del usuario autenticado
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Información del usuario
 *       401:
 *         description: No autorizado
 */

authRouter.get("/me", me);

export default authRouter;



