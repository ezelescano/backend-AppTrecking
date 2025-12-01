import { supabase } from "../config/supabase";
import { PostDTO } from "../DTO/PostDTO";
import { BadRequest, Conflict, Forbidden, InternalError, NotFound } from "../errors";
import { IComments } from "../interfaces/IComments";
import { IPost } from "../interfaces/IPost";
import { IPostComments } from "../interfaces/IPostComments";

export const getUserLoggedPosts = async (userId: string): Promise<IPost[]> => {
  const {data: postData, error: postError} = await supabase
  .from("posts")
  .select("*")
  .eq("user_id", userId)
  .order("created_at", { ascending: false });

  if(postError) throw InternalError(postError.message);
  if(!postData) return [];
  return postData as IPost[];
};

export const getAllPost = async (): Promise<IPost[]> => {
  const {data: postData, error: postError} = await supabase
  .from("posts")
  .select("*")
  .order("created_at", { ascending: false });

  if(postError) throw BadRequest(postError.message);
  if(!postData) return [];
  return postData as IPost[];
};

export const getPostById = async (postId: string): Promise<IPostComments> => {
  const {data: postData, error: postError} = await supabase
  .from("posts")
  .select("*")
  .eq("id", postId)
  .single();
  
  if(postError) throw InternalError(postError.message);
  if(!postData) throw NotFound("Post not found");

  const {data: commentsData, error: commentsError} = await supabase
  .from("comments")
  .select("*")
  .eq("post_id", postId)
  .order("created_at", { ascending: true });

  if(commentsError) throw InternalError(commentsError.message);

  return {
    ...postData,
    comments: commentsData as IComments[],
  };
};

export const createPost = async (newPost: PostDTO, userId: string): Promise<IPost> =>{
  if(!newPost.content || newPost.content.trim() === ""){
    throw new Error("Post content cannot be empty");
  }
  const { data: postData, error: postError} = await supabase
  .from("posts")
  .insert({
    user_id: userId,
    content: newPost.content,
    image_url: newPost.image_url,
    place_id: newPost.place_id,
  })
  .select()
  .single();

  if(postError) throw BadRequest(postError.message);
  if(!postData || postData.length === 0) throw InternalError("Post not created");

  return postData as IPost;
};

export const deletePost = async (postId: string, userId: string): Promise<string> => {
 
  const {data: postData, error: postError} = await supabase
  .from("posts")
  .select("*")
  .eq("id", postId)
  .single();

  if(postError) throw InternalError(postError.message);
  if(!postData) throw NotFound("Post not found");
  if(postData.user_id !== userId){
    throw Forbidden("Unauthorized to delete this post");
  }
  const {error: deleteError} = await supabase
  .from("posts")
  .delete()
  .eq("id", postId);

  if(deleteError) throw InternalError(deleteError.message);
  return "Post deleted successfully";
};

export const updatePost = async (postId: string, updateContent: Partial<PostDTO>, userId: string): Promise<IPost> => {


  const { data: postData, error: postError } = await supabase
    .from("posts")
    .select("*")
    .eq("id", postId)
    .single();

  if (postError) throw InternalError(postError.message);
  if (!postData) throw NotFound("Post not found");
  if (postData.user_id !== userId) throw Forbidden("Unauthorized to update this post");

  const { data: updatedPost, error: updatedError } = await supabase
    .from("posts")
    .update(updateContent)
    .eq("id", postId)
    .select()
    .single();

  if (updatedError) throw BadRequest(updatedError.message);
  if (!updatedPost || updatedPost.length === 0) throw InternalError("Post not updated");

  return updatedPost as IPost;
};



