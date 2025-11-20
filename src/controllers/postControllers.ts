import { Request, Response } from "express";
import { createPost, deletePost, getAllPost, getPostById, getUserLoggedPosts, updatePost } from "../services/postServices";

export const getAllLoggedPosts = async (req: Request, res: Response) => {

    
    try {
        const accessToken = req.headers.authorization?.split(" ")[1];
        if (!accessToken) return res.status(401).json({ error: "Unauthorized" });

        const posts = await getUserLoggedPosts(accessToken);
        return res.status(200).json(posts);
    } catch (error: any) {
        const statusCode = error.status || 500;
        const message = error.message || "Internal Server Error";
       return res.status(statusCode).json({ error: message }); 
    }
} 

export const getAllPostsController = async (req: Request, res: Response) => {
    try {
        const posts = await getAllPost();
        
        if (!posts || posts.length === 0) {
            return res.status(404).json({ message: "No posts found" });
        }
        res.status(200).json(posts);
    } catch (error: any) {
        const statusCode = error.status || 500;
        const message = error.message || "Internal Server Error";
        return res.status(statusCode).json({ error: message });
    }
}

export const getPostByIdController = async (req: Request, res: Response) => {
    try {
        const postId = req.params.id;
        const postWhithComments = await getPostById(postId);
        if (!postWhithComments) throw new Error("Post not found");
        res.status(200).json(postWhithComments);
    } catch (error : any) {
        const statusCode = error.status || 500;
        const message = error.message || "Internal Server Error"
    }
};

export const createPostController = async (req: Request, res: Response) => {
    try {
        const accessToken = req.headers.authorization?.split(" ")[1];
        if (!accessToken) return res.status(401).json({ error: "Unauthorized" });
        const userId = req.body.userId; // Assuming userId is sent in the request body
        const newPost = req.body;
        if (!newPost) return res.status(400).json({ error: "Post data is required" });
        const createdPost = await createPost(newPost, userId);
        return res.status(201).json(createdPost);
    } catch (error: any) {
        const statusCode = error.status || 500;
        const message = error.message || "Internal Server Error";
        return res.status(statusCode).json({ error: message });
    }
};

export const deletePostController = async (req: Request, res: Response) => {
    try {
        const accessToken = req.headers.authorization?.split(" ")[1];
        if(!accessToken) return res.status(401).json({error: "Unauthorized"});
        const postId = req.params.id;
        const deletedPostId = await deletePost(postId, accessToken);
        return res.status(200).json({ message: `Post with ID ${deletedPostId} deleted successfully` });
    } catch (error : any) {
        const statusCode = error.status || 500;
        const message = error.message || "Internal Server Error";
        return res.status(statusCode).json({ error: message });
    }
};

export const updatePostController = async (req: Request, res: Response) => {
    try {
        const accessToken = req.headers.authorization?.split(" ")[1];
        if(!accessToken) return res.status(401).json({error: "Unauthorized"});
        const postId = req.params.id;
        const updateContent = req.body;
        if(!updateContent) return res.status(400).json({error: "Update data is required"});
        const updatedPost = await updatePost(postId, updateContent, accessToken);
        return res.status(200).json(updatedPost);
    } catch (error: any) {
        const statusCode = error.status || 500;
        const message = error.message || "Internal Server Error";
        return res.status(statusCode).json({ error: message });
    }
}