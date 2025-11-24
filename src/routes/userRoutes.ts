import { Router } from "express";
import {
  completeProfController,
  getUserByIdController,
  getUsersController,
  updateProfileController
} from "../controllers/usersControllers";
import { authenticateUser } from "../middelwares/authenticates";

const userRouter: Router = Router();

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Obtener el perfil completo del usuario logueado
 *     description: Retorna los datos del usuario autenticado junto con su perfil asociado.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Token faltante o inválido
 *       404:
 *         description: Perfil no encontrado
 *       500:
 *         description: Error interno del servidor
 */
userRouter.get("/profile", authenticateUser, getUsersController);

/**
 * @swagger
 * tags:
 *   - name: User
 *     description: User profile operations
 * /profile:
 *   put:
 *     summary: Update logged user's profile
 *     description: Updates the profile of the authenticated user using the data sent in the request body.
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_name:
 *                 type: string
 *               full_name:
 *                 type: string
 *               avatar_url:
 *                 type: string
 *               role:
 *                 type: string
 *               gender:
 * type: string
 *             example:
 *               user_name: "Ezequiel"
 *               avatarUrl: "https://example.com/avatar.png"
 *               full_name: "Ezequiel Lescano"
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized — missing or invalid token
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

userRouter.put("/profile", authenticateUser, updateProfileController)

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Retrieve a user by their unique ID
 *     description: Returns the complete profile information of a user based on the provided ID.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the user you want to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved user data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid or missing user ID.
 *       401:
 *         description: Unauthorized. Authentication token is missing or invalid.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
userRouter.get("/:id", authenticateUser,getUserByIdController);

/**
 * @swagger
 * /users/profile:
 *   post:
 *     summary: Create a new user profile
 *     description: Creates a complete profile for the authenticated user. This endpoint only works if the user does not already have a profile.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserDTO'
 *     responses:
 *       201:
 *         description: Profile successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 profile:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid profile data
 *       401:
 *         description: Unauthorized — Missing or invalid token
 *       409:
 *         description: Profile already exists
 *       500:
 *         description: Internal server error
 */

userRouter.post("/profile", authenticateUser, completeProfController);




export default userRouter;

