import { Router } from "express";
import { authenticateUser } from "../middelwares/authenticates";
import {
  followUserController,
  getFollowersController,
  getFollowingController,
  unfollowUserController,
} from "../controllers/followController";

const followRouter: Router = Router();

/**
 * @swagger
 * /follows/{id}:
 *   post:
 *     summary: Follow a user
 *     description: Authenticated user follows another user
 *     tags: [Follows]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to follow
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: User followed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User followed successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       409:
 *         description: Already following this user
 */

followRouter.post("/:id", authenticateUser, followUserController);

/**
 * @swagger
 * /follows/{id}:
 *   delete:
 *     summary: Unfollow a user
 *     description: Authenticated user stops following another user
 *     tags: [Follows]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to unfollow
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: User unfollowed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User unfollowed successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Follow relationship not found
 */

followRouter.delete("/:id", authenticateUser, unfollowUserController);

/**
 * @swagger
 * /follows/followers:
 *   get:
 *     summary: Get my followers
 *     description: Returns the list of users that follow the authenticated user
 *     tags: [Follows]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of followers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   following_user_id:
 *                     type: string
 *                     format: uuid
 *                   userProfile:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */

followRouter.get("/followers", authenticateUser, getFollowersController);

/**
 * @swagger
 * /follows/following:
 *   get:
 *     summary: Get users I follow
 *     description: Returns the list of users that the authenticated user is following
 *     tags: [Follows]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of followed users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   followed_user_id:
 *                     type: string
 *                     format: uuid
 *                   userProfile:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */

followRouter.get("/following", authenticateUser, getFollowingController);

export default followRouter;
