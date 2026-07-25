import type {RequestHandler} from "express";
import { verifyToken } from "../controllers/token";

export const ProtectRoute:RequestHandler=(req,res,next)=>{
    try{

 const authHeader=req.headers.authorization;

 if(!authHeader){
     return res.status(401).json({
         message:"You are not authorized to access this page"
     })
 }

const accessToken=authHeader.split(" ")[1];


const decoded= verifyToken(accessToken!);
 if(typeof decoded=="string"||!decoded.userId||!decoded.sessionId){ 

    return res.status(401).json({
        message:"Invalid Token"
    })
 }
const {userId,sessionId}=decoded;
req.user={userId,sessionId};
   next();

}
catch(err:any){

    if(err.name==="TokenExpiredError"){
        return res.status(403).json({
            message:"Token Expired"
        })
    }
    return res.status(403).json({
        message:"Invalid Token"
    })
}
}