import type { RequestHandler } from "express";
import { pool } from "../db/connect";
import bcrypt from "bcrypt";
import { generateToken } from "./token";
export const cookieOptions={
    httpOnly:true,
    secure:true,
    sameSite:"none",
} as const

export const SignInUserController:RequestHandler=async  (req,res)=>{

try{

    const {email,password}=req.body;
 const { rowCount}=await pool.query<{email:string}>(`select email from users where email=$1`,[email]);
if(rowCount==0){
  res.status(400).json({
    message:"Invalid Email or Password" 
  })
}
const { rows:[user] }=await pool.query<{id:string,password:string}>(`select id,password from users where email=$1`,[email]);
 const isPasswordValid= await bcrypt.compare(password,user!.password);
 if(!isPasswordValid){
    res.status(400).json({
        message:"Invalid Email or Password"
    })
 }
    const token=generateToken(user!.id);
res.cookie('token',token,cookieOptions);
res.status(200).json({message:"User signed in successfully", user: user!.id});
}
catch(error){
 console.error(error);
  res.status(400).json({message:"Error signing in user"});
}
}
export const SignUpUserController:RequestHandler=async (req,res)=>{
    const client= await pool.connect();
try{
    let {email,password,name}=req.body;
    const {rowCount,rows}=await client.query(`select email from users where email=$1`,[req.body.email]);
    console.log(rowCount,rows)
    if(rowCount!>0){
        console.log("Iam Inside")
       return  res.status(400).json({message:"User already exists"});
    }
    
    await client.query('BEGIN')
 const hashedPassword=await bcrypt.hash(password, 10);

 const { rows:[uid] }=await client.query<{id:string}>(`insert into users (email,password,name) values ($1,$2,$3) returning id`,[email,hashedPassword,"name"]);
   const token=generateToken(uid!.id);
res.cookie('token',token,cookieOptions);

await client.query('COMMIT')
return  res.status(201).json({message:"User created successfully", user: uid!.id});
}
catch(error){
   await client.query('ROLLBACK');
 console.error(error);
 return res.status(400).json({message:"Error Signing up user Try again later baby 😘"});
}
finally{
    client.release();
}


}
