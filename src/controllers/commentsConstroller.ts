import { Request, Response } from "express";
import { createComment } from "../services/commentServices";

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


