import { supabase } from "../config/supabase";
import { IAuthUser } from "../interfaces/IauthUser";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const registerUser = async (
  email: string,
  password: string
): Promise<IAuthUser> => {
   
  try {
    if (!email || !password) throw new Error("Email and password are required");
    if (!emailRegex.test(email)) throw new Error("Invalid email format");
    if (password.length < 8 || password.length > 20)
      throw new Error("Password must be between 8 and 20 characters long");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
  if (error) throw error;
  
  if(!data.user || !data.session) {
    throw new Error("User or session data is missing after registration");
  }
  return {
    user: data.user
    ? {
      id: data.user.id,
      email: data.user.email!,
    }
    : null,
    session: data.session
    ? {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    }
    : null,
  };
} catch (error) {
  console.error("Error registering user:", error);
  throw error;
}
};

export const loginUser = async (
  email: string,
  password: string
): Promise<void> => {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
};

export const getUserFromToken = async (token: string): Promise<any> => {
  const { data, error } = await supabase.auth.getUser(token);
  if (error) throw error;
  return { data, error };
};

export const logOutToken = async (token: string): Promise<void> => {
  const { error } = await supabase.auth.signOut();
};
