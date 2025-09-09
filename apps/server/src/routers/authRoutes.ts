import { Router } from "express";

const authRoutes = Router();

authRoutes.get('/signup', (req, res) => { 
    return res.status(200).json({ message: "User registered succesfully!" });
})

export default authRoutes;