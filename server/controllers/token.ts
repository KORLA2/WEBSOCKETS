import jwt from 'jsonwebtoken';
import dotenv from "dotenv"
import bcrypt from "bcrypt"
import type { PoolClient } from 'pg';
dotenv.config();
const secretKey=process.env.JWT_SECRET! 
export const generateToken=(userId:string,sessionId:string,isAccessToken:boolean)=>{
    if(isAccessToken){

        return jwt.sign({userId,sessionId},secretKey,{
            expiresIn:"15m"
        })
    }
    return jwt.sign({userId,sessionId},secretKey,{
        expiresIn:"7d"
    })

}


export  const verifyToken=(token:string)=>{
return jwt.verify(token,secretKey) ;
}


export const createSession=async (userId:string,userAgent:string,ip:string,client:PoolClient)=>{
   
    const {rows:[sessionId]}=await client.query<{id:string}>(`
       insert into session 
       (userid,useragent,ip,refreshtoken) 
       values($1,$2,$3,$4) returning id`
       ,[userId,userAgent,ip,'']);
       console.log(sessionId)
   const accessToken=generateToken(userId,sessionId?.id!, true);
   const RefreshToken=generateToken(userId,sessionId?.id!,false);

  const hashRefreshToken= await bcrypt.hash(RefreshToken,10);
  await client.query(`update session set refreshtoken=$1 where id=$2`,[hashRefreshToken,sessionId?.id]);

return [accessToken,sessionId,RefreshToken];
}


