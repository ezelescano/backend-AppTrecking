import { supabase } from "../config/supabase";
import { PostDTO } from "../DTO/PostDTO";
import { IComments } from "../interfaces/IComments";
import { IPost } from "../interfaces/IPost";
import { IPostComments } from "../interfaces/IPostComments";

export const getUserLoggedPosts = async (access_token: string): Promise<IPost[]> => {
  const {data:userData, error:userError} = await supabase.auth.getUser(access_token);
  if(userError || !userData.user) throw userError ?? new Error("Invalid token");
  const userId = userData.user.id;

  const {data: postData, error: postError} = await supabase
  .from("posts")
  .select("*")
  .eq("user_id", userId)
  .order("created_at", { ascending: false });

  if(postError) throw postError;
  if(!postData) return [];
  return postData as IPost[];
};

export const getAllPost = async (): Promise<IPost[]> => {
  const {data: postData, error: postError} = await supabase
  .from("posts")
  .select("*")
  .order("created_at", { ascending: false });

  if(postError) throw postError;
  if(!postData) return [];
  return postData as IPost[];
};

export const getPostbyId = async (postId: string): Promise<IPostComments> => {
  const {data: postData, error: postError} = await supabase
  .from("posts")
  .select("*")
  .eq("id", postId)
  .single();
  
  if(postError) throw postError;
  if(!postData) throw new Error("Post not found");

  const {data: commentsData, error: commentsError} = await supabase
  .from("comments")
  .select("*")
  .eq("post_id", postId)
  .order("created_at", { ascending: true });

  if(commentsError) throw commentsError;

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

  if(postError) throw postError;
  if(!postData) throw new Error("Post not created");

  return postData as IPost;
};

export const deletePost = async (postId: string, accessToken: string): Promise<string> => {
  const {data:userData, error: userError} = await supabase.auth.getUser(accessToken)
  if(!userData.user || userError) throw userError ?? new Error("Invalid token");
  const userId = userData.user.id;

  const {data: postData, error: postError} = await supabase
  .from("post")
  .select("*")
  .eq("id", postId)
  .single();

  if(postError) throw postError;
  if(!postData) throw new Error("Post not found");
  if(postData.user_id !== userId){
    throw new Error("Unauthorized to delete this post");
  }
  const {error: deleteError} = await supabase
  .from("posts")
  .delete()
  .eq("id", postId);

  if(deleteError) throw deleteError;
  return "Post deleted successfully";
};

export const updatePost = async (postId: string, updateContent: Partial<PostDTO>, accessToken: string): Promise<IPost> => {
  const { data: userData, error: userError } = await supabase.auth.getUser(accessToken);
  if (!userData.user || userError) throw userError ?? new Error("Invalid token");
  const userId = userData.user.id;

  const { data: postData, error: postError } = await supabase
    .from("posts")
    .select("*")
    .eq("id", postId)
    .single();

  if (postError) throw postError;
  if (!postData) throw new Error("Post not found");
  if (postData.user_id !== userId) throw new Error("Unauthorized to update this post");

  const { data: updatedPost, error: updateError } = await supabase
    .from("posts")
    .update(updateContent)
    .eq("id", postId)
    .select()
    .single();

  if (updateError) throw updateError;
  if (!updatedPost) throw new Error("Post not updated");

  return updatedPost as IPost;
};



