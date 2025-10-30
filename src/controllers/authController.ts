import { Request, Response } from "express";
import { registerUser } from "../services/authServices";

export const register = async (req: Request, res: Response) => {
    console.log("hola soy el controller");
    
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
       const result =  await registerUser(email, password); 
       
       if(!result.session) {
        return res.status(201).json({ 
            message: "User created. Check your email to confirm your account",
        user:   result.user?? null });
       }
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}