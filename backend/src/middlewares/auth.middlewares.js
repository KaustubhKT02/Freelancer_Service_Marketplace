import {asyncHandler} from '../utils/asyncHandler.utils.js';
import {apiError} from '../utils/apiError.utils.js';
import users from '../models/users.models.js'
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler(async(req, _, next) => {
   try {
     // get token from cookies or header
   const token  =  req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "");
 //   check token  are present or not
   if(!token) {
     throw new apiError(401, "Unauthorized request");
   }
 
 //   if token is present  decodeToken using jwt.verify
   const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
 
 //   store token in user exclude password or refreshToken
  const user = await users.findByPk(decodedToken?.id, {
     attributes: {
         exclude: ['password', 'refreshToken']
     }
   });
 
   
   if(!user) {
     throw new apiError(401, "Invalid Acess Token");
   }
   
   req.user = user;
 
   next()
   } catch (error) {
    throw new apiError(401, error?.message || "Invalid Access Token")
   }
})