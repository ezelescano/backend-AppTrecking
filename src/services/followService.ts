import { supabase } from "../config/supabase";
import { BadRequest, Conflict, NotFound } from "../errors";
import { FollowerWithProfile } from "../interfaces/IFollowerWithProfile";
import { IUser } from "../interfaces/IUser";

export const followUser = async (
  followerId: string,
  targetId: string
): Promise<string> => {
  if (followerId === targetId) throw BadRequest("You cannot follow your self");

  // check if user exist
  const { data: targetExist } = await supabase.auth.admin.getUserById(targetId);

  if (!targetExist) throw NotFound("User to follow does not exist");

  // check already following

  const { data: existingFollow } = await supabase
    .from("follows")
    .select("*")
    .eq("following_user_id", followerId)
    .eq("followed_user_id", targetId)
    .maybeSingle();

  if (existingFollow) throw Conflict("Already following this user");

  // insert

  const { error } = await supabase
    .from("follows")
    .insert([{ following_user_id: followerId, followed_user_id: targetId }]);

  if (error) throw BadRequest("Failed to follow user");

  return "User followed successfully";
};

export const unfollowerUser = async (
  followerId: string,
  targetId: string
): Promise<string> => {
  // check if following

  const { data: existingFollow } = await supabase
    .from("follows")
    .select("*")
    .eq("following_user_id", followerId)
    .eq("followed_user_id", targetId)
    .maybeSingle();

  if (!existingFollow) throw NotFound("You are not following this user");

  // delete

  const { error } = await supabase
    .from("follows")
    .delete()
    .eq("following_user_id", followerId)
    .eq("followed_user_id", targetId);

  if (error) throw BadRequest("Failed to unfollow user");

  return "User unfollowed succesfully";
};

export const getFollowers = async (
  userId: string
): Promise<FollowerWithProfile[]> => {
  const { data: followersUser, error: followerErrors } = await supabase
    .from("follows")
    .select<
      `
      following_user_id,
      userProfile (
        id,
        user_name,
        avatar_url
      )
    `,
      FollowerWithProfile
    >()
    .eq("followed_user_id", userId);

  if (followerErrors) throw BadRequest("Failed to get followers");

  return followersUser ?? [];
};
