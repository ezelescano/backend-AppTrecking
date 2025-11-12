import { Router } from "express";
import {
  createPostController,
  deletePostController,
  getAllLoggedPosts,
  getAllPostsController,
  getPostByIdController,
  updatePostController,
} from "../controllers/postControllers";
import { createCommentController } from "../controllers/commentsConstroller";
import { authenticateUser } from "../middelwares/authenticates";

const postRouter: Router = Router();

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Obtiene todos los posts del usuario autenticado
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Lista de posts
 */

postRouter.get("/loggeduser", getAllLoggedPosts);

/** * @swagger
 * /posts/all:
 *   get:
 *     summary: Obtiene todos los posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Lista de posts
 */

postRouter.get("/", getAllPostsController);

/** * @swagger
 * /posts/ {id}:
 *   get:
 *     summary: Obtiene un post por su ID junto con sus comentarios
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del post
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post encontrado
 *       404:
 *         description: Post no encontrado
 */

postRouter.get("/:id", getPostByIdController);

/** * @swagger
 * /posts:
 *   post:
 *     summary: Crea un nuevo post
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               image_url:
 *                 type: string
 *               place_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Post creado
 *       400:
 *         description: Datos del post inválidos
 */

postRouter.post("/", createPostController);

/** * @swagger
 * /posts/ {id}:
 *   delete:
 *     summary: Elimina un post por su ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del post
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post eliminado
 *       404:
 *         description: Post no encontrado
 */ 

postRouter.delete("/:id", deletePostController);

/** * @swagger
 * /posts/ {id}:
 *   put:
 *     summary: Actualiza un post por su ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del post
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               image_url:
 *                 type: string
 *               place_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post actualizado
 *       404:
 *         description: Post no encontrado
 */

postRouter.put("/:id", updatePostController);

/** * @swagger
 * /posts/ {id}/comments:
 *   post:
 *     summary: Crea un nuevo comentario en un post
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del post
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comentario creado
 *       400:
 *         description: Datos del comentario inválidos
 */

postRouter.post("/:id/comments", authenticateUser,  createCommentController);



export default postRouter;
