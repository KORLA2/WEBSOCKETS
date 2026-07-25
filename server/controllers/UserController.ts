import type { RequestHandler } from "express";
import { pool } from "../db/connect";

export const GetAllUsers:RequestHandler=async(req,res)=>{
try{
 const {rows}= await pool.query("select id , email, name,image, created_at,updated_at from users limit 10");
 
return  res.status(200).json({
    "users":rows
 })

}
catch(err){
    return res.status(401).json({
        message:"Not able to fetch the Users",
        error:err
    })
}

}