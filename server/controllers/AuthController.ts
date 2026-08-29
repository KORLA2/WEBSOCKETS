import type { RequestHandler } from "express";
import { pool } from "../db/connect";
import bcrypt from "bcrypt";
import { createSession, generateToken, verifyToken } from "./token";
export const cookieOptions={
    httpOnly:true,
    secure:false,
    sameSite:"lax",
    maxAge: 7*24*60*60*1000 
} as const

export const SignInUserController:RequestHandler=async  (req,res)=>{
  const client = await pool.connect();
  
try{


    const {email,password}=req.body;
    const { rowCount}=await client.query<{email:string}>(`select email from users where email=$1`,[email]);
    if(rowCount==0){
    return res.status(400).json({
        message:"Invalid Email or Password" 
    })
    }
   await  client.query('BEGIN');
const { rows:[user] }=await client.query<{id:string,hashedpassword:string}>(`select id,hashedpassword from users where email=$1`,[email]);
 const isPasswordValid= await bcrypt.compare(password,user!.hashedpassword);
 if(!isPasswordValid){
   return res.status(400).json({
        message:"Invalid Email or Password"
    })
 }
   const [accessToken,sessionId,RefreshToken]=await createSession(
    user!.id,
    req.get('User-Agent')!,
    req.ip!,
    client
)

    res.cookie('refreshToken',RefreshToken,cookieOptions);
        await  client.query('COMMIT');
      return   res.status(200).json({
            message:"User signed in successfully", 
            userId: user!.id,
            accessToken,
            
        });
}
catch(error){
    await  client.query('ROLLBACK');
   return  res.status(400).json({message:"Error signing in user"});
}
 finally{
    client.release();
 }

}
export const SignUpUserController:RequestHandler=async (req,res)=>{
    const client= await pool.connect();
try{
    let {email,password,name}=req.body;
    const {rowCount,rows}=await client.query(`select email from users where email=$1`,[req.body.email]);
    if(rowCount!>0){
       return  res.status(400).json({message:"User already exists"});
    }
    
    await client.query('BEGIN')
 const hashedPassword=await bcrypt.hash(password, 10);

 const { rows:[uid] }=await client.query<{id:string}>(`insert into users (email,hashedpassword,name) values ($1,$2,$3) returning id`,[email,hashedPassword,name]);

   const [accessToken,sessionId,RefreshToken]=await createSession(
     uid!.id,
    req.get('User-Agent')!,
    req.ip!,
    client
)
 
res.cookie('refreshToken',RefreshToken,cookieOptions);



await client.query('COMMIT')
return  res.status(201).json({message:"User created successfully", 
    userId: uid!.id,
    accessToken,
    
});
}
catch(error){
   await client.query('ROLLBACK');
 console.error(error);
 return res.status(400).json({message:"Error Signing up user Try again later"});
}
finally{
    client.release();
}


}


export const rotateTokens:RequestHandler=async (req,res)=>{

 const refreshtoken= req.cookies.refreshToken;
 console.log(refreshtoken);
 if(!refreshtoken)
    return res.status(401).json({
        message:"You are not authorized to access this page"
    })

    const {userId,sessionId}=verifyToken(refreshtoken);
    const {rows:[s]}=await pool.query<{refreshtoken:string}>(`select refreshtoken from session where id=$1`,[sessionId])
    const tokenValid= await bcrypt.compare(refreshtoken,s!.refreshtoken);
  if(!tokenValid)
    return res.status(401).json({
        message:"haha You stole refresh token that will not work here"
    })

  const accessToken=generateToken(userId,sessionId,true);
  const newRefreshToken=generateToken(userId,sessionId,false);

  const hashRefreshToken= await bcrypt.hash(newRefreshToken,10);

   const {rows:[session]}=await pool.query<{id:string}>(`update session set refreshtoken=$1 where id=$2 RETURNING id`,[hashRefreshToken,sessionId])
    res.cookie('refreshToken',newRefreshToken,cookieOptions);
   return  res.status(200).json({
        accessToken,
        
        
    })


}


export const Logout:RequestHandler= async (req,res)=>{
   try{
        const refToken=req.cookies.refreshToken;
        console.log("refresh Token:", refToken)
        if(!refToken){
            return res.status(400).json({
                message:"No Token found"
            })
        }
         const decoded= verifyToken(refToken);
         if(typeof decoded == "string"|| !decoded.sessionId|| !decoded.userId){
               return res.status(401).json({
                    message:"Invalid Token"
                })
         }
         const {sessionId}= decoded
         await pool.query(`delete from session where id=$1`,[sessionId]);
      res.clearCookie('refreshToken');
    
     return  res.status(200).json({
        message:"Logged out Successfully"
     })
    }
    catch(err){
        console.log(err)
    res.status(400).json({
        message:"Some thign wrong in logout"
    })
    }
}


export const GetMe:RequestHandler=async(req,res)=>{
    try{
 console.log("Hellooooooooooooo")
    const refreshToken=req.cookies.refreshToken;
    if(!refreshToken){
        return res.status(401).json({
            message:"You are not authorized to access this page"
        })
    }
    const decoded=verifyToken(refreshToken);
 if(typeof decoded=="string"||!decoded.userId||!decoded.sessionId){ 

    return res.status(401).json({
        message:"Invalid Token"
    })
 }
 const {userId,sessionId}=decoded
 const accessToken=generateToken(userId,sessionId,true)
 const {rows:[user],rowCount}=  await pool.query<{id:string,email:string,name:string,image:string}>(`select id, name, email,image from users where id=$1`,[userId]);
 if(!rowCount)
return res.status(400).json({
    message:"Invalid Request"
})
const {id:_,...rest}=user!;
 return res.status(200).json({
   user:{
     userId,
     ...rest,
    accessToken
   }
}

  )
}
catch(err:any){
  return res.status(403).json({
    "message":"Token expired"
  }) 
}
}



