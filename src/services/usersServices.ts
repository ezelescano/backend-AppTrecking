import { supabase } from "../config/supabase";
import { IUser } from "../interfaces/IUser";
import { UserDTO } from "../DTO/UserDTO";

export const getUsers = async (): Promise<IUser[]> => {
  try {
    const { data, error } = await supabase.from("user").select("*");
    if (error) throw error;

    console.log("soy el data", data);
    
    return data ?? [];
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const createUser = async (data: UserDTO): Promise<IUser> => {
  try {
    const { data: newUser, error } = await supabase
      .from("user")
      .insert(data)
      .select()
      .single();

    if (error) throw error;

    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

export const getUserById = async (userId: string): Promise<IUser> => {
  try {
    const { data, error } = await supabase
      .from("user")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        const notFoundError = new Error("User not found");
        notFoundError.name = "NotFoundError";
        throw notFoundError;
      }
      throw error;
    }

    if (!data) {
      const notFoundError = new Error("User not found");
      notFoundError.name = "NotFoundError";
      throw notFoundError;
    }

    return data;
  } catch (err) {
    console.error("Error fetching user by ID:", err);
    throw err;
  }
};


export const updateUser = async (userId: string, userData: UserDTO): Promise<IUser> => {
try {
  const newData: Partial<UserDTO> = {};
 
  for (const key in userData) {
    const k = key as keyof UserDTO;
    const value = userData[k];
    if(value != null && value !== undefined) newData[k] = value;
  }

  if (Object.keys(newData).length === 0) {
    const {data: existing } = await supabase.from("user").select("*").eq("id", userId).single();
    if (!existing) {
      const notFoundError = new Error("User not found");
      notFoundError.name = "NotFoundError";
      throw notFoundError;
    }
    return existing;
  }
  const { data, error } = await supabase
    .from("user")
    .update(newData)
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;

  return data;
} catch (error) {
  console.error("Error updating user:", error);
  throw error;
}
}

export const deleteUser = async (userId: string): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from("user")
      .delete()
      .eq("id", userId)
      .select();

    if (error) {
      console.error("Error deleting user:", error);
      throw error;
    }

    if (!data || !Array.isArray(data) || data.length === 0) {
      return "No user found with the given ID";
    }

    return "User deleted successfully";
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

