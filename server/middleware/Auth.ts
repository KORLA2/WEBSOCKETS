import type { RequestHandler} from "express";
import {signInSchema,signUpSchema} from "../schemas/AuthSchema";

export const ValidateUser:RequestHandler=(req,res,next)=>{
  const path=req.path;
  const schema=path=="/signIn"?signInSchema:signUpSchema;
  const result=schema.safeParse(req.body);
  console.log(result.error?.issues[0]?.message);
  if(!result.success){
    return res.status(400).json({errors:result.error.issues[0]?.message});
  }
  next();
} 