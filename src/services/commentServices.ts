import { supabase } from "../config/supabase";
import { CommentDTO } from "../DTO/CommentDTO";
import { IComments } from "../interfaces/IComments";

export const createComment = async (
  userId: string,
  { postId, content }: { postId: string; content: string }
): Promise<IComments> => {
  if (userId === null) throw new Error("Invalid user ID");

  if (!content || content.trim() === "")
    throw new Error("Comment content cannot be empty");
  const { data: commentData, error: commentError } = await supabase
    .from("comments")
    .insert({
      content: content,
      user_id: userId,
      post_id: postId,
    })
    .select()
    .single();
  if (commentError) throw commentError;
  if (!commentData) throw new Error("Comment creation failed");
  return commentData;
};

export const deleteComment = async (userId: string, postId: string, commentId: string) : Promise<string> => {
  if (!userId ) throw new Error("Invalid user ID");
  if (!postId ) throw new Error("Invalid post ID");
  if (!commentId ) throw new Error("Invalid comment ID");

  const {data: commentData, }

};

export const updateComment = async () => {};
