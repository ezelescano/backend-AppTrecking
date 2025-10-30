export interface IAuthUser {    
   user: {
    id: string;
    email: string;
   } | null;
   session: {
    access_token: string;
    refresh_token: string;
   } | null;
}