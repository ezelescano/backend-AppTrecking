import { Router } from "express";
import { register } from "../controllers/authController";

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

authRouter.post("/login", (req, res) => {
  // Lógica de autenticación aquí
  res.send("Login endpoint");
}   );

authRouter.post("/logout", (req, res) => {
  // Lógica de cierre de sesión aquí
  res.send("Logout endpoint");
}   );

export default authRouter;



