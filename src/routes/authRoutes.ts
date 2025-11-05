import { Router } from "express";
import { register, login,  logout } from "../controllers/authController";

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

authRouter.post("/login", login );

authRouter.post("/logout", logout  );

export default authRouter;



