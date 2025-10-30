import { Router } from "express";

const postRouter: Router = Router();

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Obtiene todos los posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Lista de posts
 */

postRouter.get("/", (req, res) => {
  res.status(200).json({ message: "Lista de posts" });
});
export default postRouter;
