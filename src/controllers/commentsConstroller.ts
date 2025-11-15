import { Request, Response } from "express";
import { createComment, deleteComment, updateComment } from "../services/commentServices";

export const createCommentController = async (req: Request, res: Response) => {
    
    try {   
        const { content} = req.body;
        const postId = req.params.id;     
        const userId = ( req as any ).user.id;
        
        if(!postId || !content) {
            return res.status(400).json({message: "Invalid comment data"});
        }
        const newComment = await createComment(userId, { postId, content });
        return res.status(201).json(newComment);
    } catch (error : any) {
        const statusCode = error.status || 500;
        const message = error.message || "Internal Server Error";
        return res.status(statusCode).json({message} );
    }
}

export const deleteCommentController = async (req: Request, res: Response) =>{
    try {
        const postId = req.params.postId;
        const commentId = req.params.commentId;
        const userId = ( req as any ).user.id;

        if(!postId || !commentId) {
            return res.status(400).json({message: "Invalid data to delete comment"});
        }
        const result = await deleteComment( userId, postId, commentId);
        return res.status(200).json(result);
    } catch (error : any) {
        const statusCode = error.status || 500;
        const message = error.message || "Internal Server Error";
        return res.status(statusCode).json({message} );
    }
}

export const updateCommentController = async (req:Request, res: Response) => {
    try {
        const postId = req.params.postId;
        const commentId = req.params.commentId;
        const userId = ( req as any ).user.id;
        const { content } = req.body;

        if(!postId || !commentId || !content) {
            return res.status(400).json({message: "Invalid data to update comment"});
        }
        const updatedComment = await updateComment(userId, postId, commentId, content);
        return res.status(200).json(updatedComment);
        
    } catch (error :any) {
        const statusCode = error.status || 500;
        const message = error.message || "Internal Server Error";
        return res.status(statusCode).json({message} );
    }
}