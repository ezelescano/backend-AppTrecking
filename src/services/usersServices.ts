  import { supabase } from "../config/supabase";
  import { IUser, IUserProfile } from "../interfaces/IUser";

  export const getUserWhithProfile = async (userId: string) : Promise<IUser> => {
    if(!userId || userId.trim() === "") throw new Error("User ID cannot be empty");

    const {data: userData, error: userError} = await supabase
    .from("userProfile")
    .select("*")
    .eq("id", userId)
    .single();

    if(userError) throw userError;
    if(!userData) throw new Error("User not found");

    // get user auth data

    const {data: userAuth, error: userAuthError} = await supabase.auth.admin.getUserById(userId)

    if(userAuthError) throw userAuthError;
    
    const authUser = userAuth.user;

    return{
      UID: authUser.id,
      displayName: authUser.user_metadata.full_name || null,
      email: authUser.email || null,
      phone: authUser.phone || null,
      providers: authUser.identities ? authUser.identities.map(identity => identity.provider) : [],
      providerType: authUser.identities && authUser.identities.length > 0 ? authUser.identities[0].provider : "unknown",
      userProfile: {
        user_name: userData.user_name,
        full_name: userData.full_name || null,
        avatar_url: userData.avatar_url || null,
        role: userData.role,
        gender: userData.gender || null
      }, 
    };    
  };