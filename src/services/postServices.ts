import { supabase } from "../config/supabase";
import { IPost } from "../interfaces/IPost";

export const getPosts = async (): Promise<IPost[]> => {
  try {
    const { data, error } = await supabase.from("posts").select("*");
    if (error) throw error;
    return data as IPost[];
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};
