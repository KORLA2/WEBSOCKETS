import jwt from 'jsonwebtoken';
import dotenv from "dotenv"
dotenv.config();
const secretKey=process.env.JWT_SECRET! 
export const generateToken=(userId:string)=>{
return jwt.sign({userId},secretKey,{
    expiresIn:"1h"
})

}
export  const verfiyToken=(token:string)=>{
return jwt.verify(token,secretKey)
}