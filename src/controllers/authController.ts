import { Request, Response } from "express";
import { registerUser, loginUser, logOutToken, getUserFromToken } from "../services/authServices";

export const register = async (req: Request, res: Response) => {

    try {
        const {email, password} = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
       const result =  await registerUser(email, password); 

       // if no session is returned, it means email confirmation is required
       if(!result.session) {
        return res.status(201).json({ 
            message: "User created. Check your email to confirm your account",
        user:   result.user?? null,
    });
       }
        res.cookie("refresh_token", result.session!.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });

    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


export const login = async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body; 
        const result = await loginUser(email, password);

        // if no session, email not confirmed 
        if(!result.session) {
            return res.status(403).json({
                 message: "Check your email to confirm your account",
                user: result.user ?? null,
                });
        }

        // save refresh_token in httpOnly cookie
            res.cookie("refresh_token", result.session.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            path: "/",
          });

        //   return user and access_token to client
          return res.status(200).json({
            message: "Login successful",
            user: result.user,
            access_token: result.session!.access_token,
        });
        
    } catch (err: any) {
        console.error("Error logging in user:", err.message ?? "Unknown error");
        const status = err?.status ?? 401;
        const message = err?.message ?? "Login failed";
        return res.status(status).json({ error: message });
    }
}

export const logout = async (req: Request, res: Response) => {
   try {
       const access_token = req.headers.authorization?.split(" ")[1];
       
       if (!access_token) {
           return res.status(400).json({ message: "Access token is required" });
       }
       await logOutToken(access_token);

    //    clear the refresh_token cookie
       res.clearCookie("refresh_token", {
           httpOnly: true,
           secure: process.env.NODE_ENV === "production",
           sameSite: "strict",
           path: "/",
       });

    //    response to client
         return  res.status(200).json({ message: "Logout successful" });
   } catch (error: any) {
       console.error("Error logging out user:", error.message ?? error);
       return res.status(500).json({ message: "Logout failed" });
   }
}

export const me = async (req: Request, res: Response) => {
    try {
        const access_token = req.headers.authorization?.split(" ")[1];
        if (!access_token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await getUserFromToken(access_token);
        return res.status(200).json({ user });  
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
