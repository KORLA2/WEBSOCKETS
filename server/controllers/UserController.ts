import type { RequestHandler } from "express";
import { pool } from "../db/connect";
import { uploadToCloudinary } from "../helpers/UploadToCloudinary";

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
export const UpdateUserProfile:RequestHandler=async(req,res)=>{
try{
    if(!req.user){
    return res.status(401).json({
        message:"Unauthorized You are not logged in"
    })
}
   const{userId}=req.user;
  const {name}=req.body;
  let imageUrl:string|undefined;

if(req.file){
   const uploaded=await uploadToCloudinary(req.file) ;
  console.log(uploaded);
  imageUrl=uploaded.secure_url;

}
const {rowCount, rows}= await pool.query(`update users set name=coalesce($1, name),image=coalesce($2, image),updated_at=now() where id=$3  RETURNING id, name, image, updated_at`,[name,imageUrl,userId])
if(!rowCount){
    return res.status(404).json({
        message:"User not found"
    })
}
return res.status(200).json({
    message:"Profile updated successfully",
    user:rows[0]
})


}
catch(err){
    console.log(err)
    return res.status(500).json({
        message:"Not able to update the profile",
        error:err
    })
}
}