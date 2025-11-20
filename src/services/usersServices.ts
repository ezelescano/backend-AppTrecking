import { supabase } from "../config/supabase";
import { BadRequest, NotFound } from "../errors";
import { IUser, IUserProfile } from "../interfaces/IUser";

export const getUserWhithProfile = async (userId: string): Promise<IUser> => {
  if (!userId || userId.trim() === "")
    throw BadRequest("User ID cannot be empty");

  const { data: userData, error: userError } = await supabase
    .from("userProfile")
    .select("*")
    .eq("id", userId)
    .maybeSingle<IUserProfile>();

  if (userError) throw BadRequest(userError.message);

  // get user auth data

  const { data: userAuth, error: userAuthError } =
    await supabase.auth.admin.getUserById(userId);

  if (userAuthError) throw BadRequest(userAuthError.message);
  if (!userAuth) throw NotFound("User auth data not found");

  const authUser = userAuth.user;

  return {
    UID: authUser.id,
    displayName: authUser.user_metadata.full_name || null,
    email: authUser.email || null,
    phone: authUser.phone || null,
    providers: authUser.identities
      ? authUser.identities.map((identity) => identity.provider)
      : [],
    providerType:
      authUser.identities && authUser.identities.length > 0
        ? authUser.identities[0].provider
        : "unknown",
    userProfile: userData
      ? {
          user_name: userData.user_name || null,
          full_name: userData.full_name || null,
          avatar_url: userData.avatar_url || null,
          role: userData.role || null,
          gender: userData.gender || null,
        }
      : null,
  };
};


