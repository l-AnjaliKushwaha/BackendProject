import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async(req, res, next) => {
            try {
                        const token = req.cookies?.accessToken || req.header
                        ("Authorization")?.replace("Bearer", "")
            
                        if(!token){
                                    throw new ApiError(401, 'Not authenticated')
                        }
            
                        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
            
                        await User.findById(decodedToken?._id).select("-password -refreshToken")
            
                        if(!User){
                                    throw new ApiError(401, "Invalid Access Token")
                        }
            
                        req.user = user;
                        next()
            } catch (error) {
                        throw new ApiError(401, error?.message || "Inavalid access token")
            }           
})
