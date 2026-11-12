import type { Request, RequestHandler, Response } from "express";
import { pool } from "../db/connect";
import { uploadToCloudinary } from "../helpers/UploadToCloudinary";
import { onlineUsers } from "../src/types/OnlineUsers";
export const CreateMessageController=async(req:Request,res:Response)=>{
  const client=await pool.connect();
 try{
    if(!req.user){
    return res.status(401).json({
        message:"Unauthorized You are not logged in"
    })
   }
    const{message,conversationId}=req.body;
    const body = typeof message === "string" ? message.trim() : null;
    let imageUrl:string|null = null;
     if(!conversationId || (!body && !req.file)){
      return res.status(400).json({
        message:"conversation ID and message or image required"
      })
    }
      if(req.file){
      const uploaded=await uploadToCloudinary(req.file) ;
      imageUrl=uploaded.secure_url;

    }
    const {userId:senderId}=req.user;

    await client.query('BEGIN');
 
    const {rows:[messageRows]}=await client.query(
      'insert into messages (cid,body,image,senderid) values($1,$2,$3,$4) returning *',
      [conversationId,body,imageUrl,senderId]
    );

    await client.query('update conversation set lastmessageat=now() , lastmessageid=$1 where id=$2',[messageRows.id,conversationId])
    const {rows:members}=await client.query<{uid:string,name:string,image:string}>('select uid,u.image,u.name from conversationmembers cm  join users u on cm.uid=u.id  where conversationid=$1',[conversationId])

    for(const member of members ){
      const userId=member.uid;
      console.log("Member UserId ",userId)
      const ws=onlineUsers.get(userId);
   const modMessage={
    body:messageRows.body,
    image:messageRows.image,
    conversationId,
    createdAt:messageRows.createdat,
    id:messageRows.id,
    isMine:member.uid==senderId,
    senderAvatar:member.image,
    senderName: member.name
   }

      ws?.send(JSON.stringify({
        event:"send",
        message:{...modMessage}
      
      }));
    }

    await client.query('COMMIT'); 
    return res.status(201).json({
      conversationId,
      message:messageRows
    })
}

catch(err:any){
  await client.query('ROLLBACK');
  console.log(err)
  return res.status(401).json({
    "message":"Message Not sent some error",
    error: err
  })
}

finally{
 client.release()

}
}

export const DeleteMessageController:RequestHandler=async(req,res)=>{
 try{

    const {id}=req.body;
    console.log("Deleting Message ID",id)
    if(!id||!req.user){
      return res.status(400).json({
        message:"Message ID and User ID required"
      })
    }
    const {userId}=req.user;
   const {rowCount}= await pool.query(`insert into deletedmessages (mid,uid) values($1,$2) returning mid`,[id,userId])
    
   if(rowCount===0){
    console.log("Message not found or already deleted")
    return res.status(404).json({
      message:"Message not found or already deleted"
    })
   }
   console.log("Message Deleted Successfully",id)
    return res.status(200).json({
      message:"Message deleted successfully"
    })
  
  }
 catch(err:any){
   res.status(500).json({
    message:"Error deleting message",
    error:err.message
   })
 }

}



