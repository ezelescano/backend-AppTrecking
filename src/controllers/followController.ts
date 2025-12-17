import { Request, Response } from "express";
import {
  followUser,
  getFollowers,
  getFollowing,
  unfollowerUser,
} from "../services/followService";
import { NotFound } from "../errors";

export const followUserController = async (req: Request, res: Response) => {
  const followerId = (req as any).user.id;
  const targetId = req.params.id;

  try {
    if (!targetId) throw NotFound("Target user ID is required");
    const message = await followUser(followerId, targetId);
    res.status(200).json({ message });
  } catch (error: any) {
    const statusCode = error.message || 500;

    const errorMessage = error.message || "Internal Server Error";
    res.status(statusCode).json({ error: errorMessage });
  }
};

export const unfollowUserController = async (req: Request, res: Response) => {
  const followerId = (req as any).user.id;
  const targetId = req.params.id;

  try {
    if (!targetId) throw NotFound("Target user Id is required");
    const message = await unfollowerUser(followerId, targetId);
    res.status(200).json({ message });
  } catch (error: any) {
    const statusCode = error.message || 500;
    const errorMessage = error.message || "Internal Server Error";
    res.status(statusCode).json({ error: errorMessage });
  }
};

export const getFollowersController = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  try {
    const followers = await getFollowers(userId);
    res.status(200).json({ followers });
  } catch (error: any) {
    const statusCode = error.message || 500;
    const errorMessage = error.message || "Internal Server Error";
    res.status(statusCode).json({ error: errorMessage });
  }
};

export const getFollowingController = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  try {
    const following = await getFollowing(userId);
    res.status(200).json({ following });
  } catch (error: any) {
    const statusCode = error.message || 500;
    const errorMessage = error.message || "Internal Server Error";
    res.status(statusCode).json({ error: errorMessage });
  }
};
