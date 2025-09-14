import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.models.js";
import dotenv from "dotenv";

dotenv.config({ path: './.env' });


export const verifyJWT = asyncHandler(async (req , res , next) => {
    try {
        // const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        const tokenRaw = req.cookies?.accessToken || req.header("Authorization");
        console.log("tokenRaw", tokenRaw);
        
        const token = typeof tokenRaw === "string" ? tokenRaw.replace("Bearer ", "") : null;

    
        if (!token) {
            throw new apiError(401, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
    
        const user = await User.findById(decodedToken?._id)
        .select("-password -refreshToken")
    
        if (!user) {
            throw new apiError(401, "Invalid Access Token")
        }
    
        req.user = user;
        next()

    } catch (error) {
        throw new apiError(401, error?.message || "Invalid access token")
    }

})
