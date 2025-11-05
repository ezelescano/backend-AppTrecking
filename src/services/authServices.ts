import { createClient } from "@supabase/supabase-js";
import { supabase } from "../config/supabase";
import { IAuthUser } from "../interfaces/IauthUser";
import { SUPABASE_KEY, SUPABASE_URL } from "../config/envs";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const registerUser = async (
  email: string,
  password: string
): Promise<IAuthUser> => {
  //  validations
  if (!email || !password) throw new Error("Email and password are required");
  if (!emailRegex.test(email)) throw new Error("Invalid email format");
  if(password.length < 8 || password.length > 20) throw new Error("Password must be between 8 and 20 characters");


  // call to supabase
  const { data, error } = await supabase.auth.signUp({email, password});
  if (error) throw error;

  if(!data.user) throw new Error("User registration failed: no user returned");

  return {
    user: {
      id: data.user.id,
      email: data.user.email!,
    },
    session: data.session
      ? {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        }
      : null,
  }
  
};

export const loginUser = async (
  email: string,
  password: string
): Promise<IAuthUser> => {

  // validations
    if (!email || !password) throw new Error("Email and password are required");
    if (!emailRegex.test(email)) throw new Error("Invalid email format");
    
    // call to supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    // check if session exists and user
    if(!data.user || !data.session) {
      return {
        user: data.user
        ? {id: data.user.id, email: data.user.email!}
        : null,
        session: null,
      };
      }
  
    return {
      user: {id: data.user.id, email: data.user.email!},
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      },
    };
};

export const logOutToken = async (access_token: string): Promise<string> => {
try {
  if(!access_token) throw new Error("Access token is required");

  const supabaseUser = createClient(
    SUPABASE_URL!,
    SUPABASE_KEY!,
  {
    global:{
      headers:{
        Authorization: `Bearer ${access_token}`,
      },
    },
  }
  );
  const { error } = await supabaseUser.auth.signOut({scope: 'local'});
  if (error) throw error;
  return "User logged out successfully";
} catch (error) {
  console.error("Error logging out user:", error);
  throw new Error("Failed to log out user");
}
};


export const getUserFromToken = async (access_token: string): Promise<any> => {
  const {data: userData, error: userError} = await supabase.auth.getUser(access_token);
  if(userError || !userData.user) throw userError ?? new Error("Invalid token");

  const userId = userData.user.id;

  const {data: profileData, error: profileError} = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if(profileError) throw profileError;

  return { ...userData.user, ...profileData };
};



