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
    let attachmentUrl:string|null = null;
    let type:string|null = null;
    let attachName:string|null=null;
     if(!conversationId || (!body && !req.file)){
      return res.status(400).json({
        message:"conversation ID and message or image required"
      })
    }

      if(req.file){
      const uploaded=await uploadToCloudinary(req.file,req.file.mimetype) ;
      attachmentUrl=uploaded.secure_url;
        type=req.file.mimetype;
        console.log(req.file)
        attachName=req.file.originalname;
    }
    const {userId:senderId}=req.user;

    await client.query('BEGIN');
    const {rowCount}=await client.query(`select 1 from conversationmembers where conversationid=$1 and  uid=$2`,[conversationId,senderId]);
    if(!rowCount){
      return res.status(403).json({
        message:"Not Authorized to send message"
      })
    }
    const {rows:[user]}=await client.query<{image:string,name:string}>(`select image,name from users where id=$1`,[senderId]);
   const {image,name}=user!;
    const {rows:[messageRows]}=await client.query(
      'insert into messages (cid,body,attachment_url,attachment_type,attachment_name,senderid) values($1,$2,$3,$4,$5,$6) returning *',
      [conversationId,body,attachmentUrl,type,attachName,senderId]
    );
    console.log("Inserted Message ",messageRows)
    await client.query('update conversation set lastmessageat=now() , lastmessageid=$1 where id=$2',[messageRows.id,conversationId])
    const {rows:members}=await client.query<{uid:string}>('select uid from conversationmembers cm  join users u on cm.uid=u.id  where conversationid=$1',[conversationId])

    for(const member of members ){
      const userId=member.uid;
      const userSockets=onlineUsers.get(userId);
      if(!userSockets) continue;
   const modMessage={
    body:messageRows.body,
    attachment:messageRows.attachment_url,
    conversationId,
    type,
    attachName,
    createdAt:messageRows.createdat,
    id:messageRows.id,
    isMine:member.uid==senderId,
    senderAvatar:image,
    senderName:name,

   }
   for(const socket of userSockets ){

     socket?.send(JSON.stringify({
       event:"send",
       message:{...modMessage}
     
     }));

   }
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
    if(!id||!req.user){
      return res.status(400).json({
        message:"Message ID and User ID required"
      })
    }
    const {userId}=req.user;
   const {rowCount}= await pool.query(`insert into deletedmessages (mid,uid) values($1,$2) returning mid`,[id,userId])
    
   if(rowCount===0){
    return res.status(404).json({
      message:"Message not found or already deleted"
    })
   }
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

export const AddReactionController:RequestHandler=async(req,res)=>{
  const client = await pool.connect();
  try{
       const {mid,cid,emoji}=req.body;
        if(!mid||!cid||!emoji||!req.user){
          return res.status(400).json({
            message:"Message ID, Conversation ID, Emoji and User ID required"
          })
        }
        await client.query("BEGIN");
        const {userId}=req.user;
        const {rowCount}=await client.query(`select 1 from conversationmembers where conversationid=$1 and uid=$2`,[cid,userId]);
        if(!rowCount){
          return res.status(403).json({
            message:"You Cannot react to the message if you are not a member of this conversation"
          })
        }
        const {rows:[existingResult]}=await client.query(
              `
              SELECT emoji FROM reactions  WHERE mid = $1  AND uid = $2  FOR UPDATE
              `,
              [mid, userId]
            );
       let action, oldEmoji = null;
       let newEmoji = null;
        if (!existingResult) {
          await client.query(
            `
            INSERT INTO reactions (mid, uid, emoji)
            VALUES ($1, $2, $3)
            `,
            [mid, userId, emoji]
          );

          action = "added";
          newEmoji = emoji;
        }

         // User clicked the same emoji: remove it
          else if (existingResult.emoji === emoji) {
            await client.query(
              `
              DELETE FROM reactions
              WHERE mid = $1
                AND uid = $2
              `,
              [mid, userId]
            );

            action = "removed";
            oldEmoji = emoji;
          }
          else {
            await client.query(
              `
              UPDATE reactions
              SET emoji = $3
              WHERE mid = $1
                AND uid = $2
              `,
              [mid, userId, emoji]
            );

            action = "changed";
            oldEmoji = existingResult.emoji;
            newEmoji = emoji;
          }


       const {rows:members}= await pool.query<{uid:string}>(`select uid from conversationmembers where conversationid=$1`,[cid]);

       for(let member of members){
        const userSockets=onlineUsers.get(member.uid);
        if(!userSockets) continue;
       for(const socket of userSockets ){
           socket.send(JSON.stringify({
            event:"reaction",
            reaction:{
              mid,
              action,
              oldEmoji,
              newEmoji,
              uid:userId
            },              
            cid
       }))
       }
       
       } 
  await client.query('COMMIT')
        return res.status(201).json({
          message:"Reaction added successfully",
          reaction:{
            mid,
            emoji,
            uid:userId
          }
        })
  }
  catch(err:any){
  await client.query('ROLLBACK')
    console.error("Error adding reaction",err)
    return res.status(500).json({
      message:"Error adding reaction",
      error:err.message
    })
  }

  finally{
    client.release();
  }
}



