import { error } from "console";
import { supabase } from "../config/supabase";
import { UserDTO } from "../DTO/UserDTO";
import { IUserProfileDTO } from "../DTO/UserProfileDTO";
import { BadRequest, Conflict, NotFound } from "../errors";
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

export const updateUserProfile = async (userId: string, userData: Partial<IUserProfileDTO>): Promise<IUserProfile> => {
  const newData: Partial<IUserProfileDTO> = {};
  for (const key in userData) {
    const k = key as keyof IUserProfileDTO;
    const value = userData[k];
    if (value != null && value !== undefined) newData[k] = value;
  }

  if (Object.keys(newData).length === 0) {
    const { data: existing } = await supabase
      .from("userProfile")
      .select("*")
      .eq("id", userId)
      .single();
    if (!existing) {
      const notFoundError = new Error("User not found");
      notFoundError.name = "NotFoundError";
      throw notFoundError;
    }
    return existing;
  }

  const { data, error } = await supabase
    .from("userProfile")
    .update(newData)
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getUserById = async (userId: string): Promise<IUserProfile> => {
  if (!userId || userId.trim() === "")
    throw BadRequest("User ID cannot be empty");

  const { data: userData, error: userError } = await supabase
    .from("userProfile")
    .select("*")
    .eq("id", userId)
    .maybeSingle<IUserProfile>();

  if (userError) throw BadRequest(userError.message);
  if (!userData) throw NotFound("User data not found");

  return {
    user_name: userData.user_name || null,
    full_name: userData.full_name || null,
    avatar_url: userData.avatar_url || null,
    role: userData.role || null,
    gender: userData.gender || null,
  };
};


export const completeProfile = async (userId: string, newProfile: IUserProfile) : Promise<IUserProfile> =>{
  if(!newProfile) throw BadRequest("Profile data is required");

  // check if profile already exist
  const {data: existData, error: existError} = await supabase
  .from("userProfile")
  .select("*")
  .eq("id", userId)
  .maybeSingle();

  if(existError) throw BadRequest(existError.message);
  if(existData) throw Conflict("Profile already exist");

  // insert new profile

  const profileToCreate = {...newProfile, id: userId};

  const {data: createdProfile, error: insertError } = await supabase
  .from("userProfile")
  .insert(profileToCreate)
  .select()
  .single();


  if (insertError) throw BadRequest(insertError.message);

  if (!createdProfile) throw NotFound("Profile could'not be created")

    return createdProfile;
};