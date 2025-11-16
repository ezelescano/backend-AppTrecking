import { supabase } from "../config/supabase";
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


  // fetch post data to verify the owner
  const {data: postData, error: postError} = await supabase
    .from("posts")
    .select("user_id")
    .eq("id", postId)
    .single();

  if (postError) throw postError;
  if (!postData) throw new Error("Post not found");

  // fetch comment to verify its author
  const {data: commentData, error: commentError} = await supabase
    .from("comments")
    .select("user_id")
    .eq("id", commentId)
    .single();

  if (commentError) throw commentError;
  if (!commentData) throw new Error("Comment not found");

  // verify if the requester is either the comment author or the post owner

  if (commentData.user_id !== userId && postData.user_id !== userId)throw new Error("Unauthorized to delete this comment");
  
    const {error: deleteError} = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId)
      .single();
  
      if(deleteError) throw deleteError;
      return "Comment deleted successfully";

};

export const updateComment = async (userId: string, postId: string, commentId:string, content: string): Promise<IComments>  => {
  if(!userId || !postId || !commentId) throw new Error("Invalid data to update comment");
  if(!content || content.trim() === "") throw new Error("Comment content cannot be empty");

  const {data: commentData, error: commentError} = await supabase
    .from("comments")
    .select("*")
    .eq("id", commentId)
    .single();

    if(commentError) throw commentError;
    if(!commentData) throw new Error("Comment not found");

    if(commentData.user_id !== userId) throw new Error("Unauthorized to update this comment");

    const {data:updateCommentData, error: updateError} = await supabase
      .from("comments")
      .update({content: content})
      .eq("id", commentId)
      .select()
      .single();

      if(updateError) throw updateError;
      if(!updateCommentData) throw new Error("Comment update failed");

      return updateCommentData;
};

