import { supabase } from "../config/supabase";
import { IUser } from "../interfaces/IUser";

export const getUsers = async (): Promise<IUser[]> => {
  try {
    const { data, error } = await supabase.from("users").select("*");
    if (error) throw error;
    return data ?? [];
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// export const createUser = async () => {
//   // Lógica para crear un nuevo usuario en la base de datos
//   return "Lógica para crear un nuevo usuario en la base de datos";
// }

export const getUserById = async (userId: string): Promise<IUser | string> => {
  const { data, error } = await supabase
    .from("users")
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

  return data;
};

// export const updateUser = async (userId: number, userData: { name?: string }) => {
//   // Lógica para actualizar un usuario en la base de datos
//   return "Lógica para actualizar un usuario en la base de datos";
// }

// export const deleteUser = async (userId: number) => {
//   // Lógica para eliminar un usuario de la base de datos
// }
