export interface IUserProfile {
  user_name: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
  role: string | null;
  gender?: string | null;
  birth_date?: Date | null
  age?: number | null  
}

export interface IUser { 
UID: string;
displayName: string | null;
email: string | null;
phone: string | null;
providers: string[];
providerType: string;
userProfile?: IUserProfile | null;
}
