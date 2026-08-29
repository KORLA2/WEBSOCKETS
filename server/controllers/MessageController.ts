import type { Request, RequestHandler, Response } from "express";
import { pool } from "../db/connect";
import { uploadToCloudinary } from "../helpers/UploadToCloudinary";
import { onlineUsers } from "../src/types/OnlineUsers";
import { create } from "domain";
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
      console.log(uploaded);
      imageUrl=uploaded.secure_url;

    }
    const {userId:senderId}=req.user;

    await client.query('BEGIN');
 
    const {rows:[messageRows]}=await client.query(
      'insert into message (cid,body,image,senderId) values($1,$2,$3,$4) returning *',
      [conversationId,body,imageUrl,senderId]
    );

    await client.query('update conversation set lastmessageat=now() , lastmessageid=$1 where id=$2',[messageRows.id,conversationId])
    const {rows:members}=await client.query<{uid:string}>('select uid from conversationmembers where conversationid=$1',[conversationId])
     console.log("My members",messageRows)

    for(const member of members ){
      const userId=member.uid;
      console.log("Member UserId ",userId)
      const ws=onlineUsers.get(userId);
      ws?.send(JSON.stringify({
        event:"send",
        message:{...messageRows,
          isSeenByMe:member.uid==senderId,
          isMine:member.uid==senderId,
          seenby:[]}

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

export const SeenMessageController:RequestHandler=async(req,res)=>{

const client=await pool.connect()
  try{
       if(!req.user){
        return res.status(400).json({
          "message":"You are not authorized"
        })
       }
      await  client.query('BEGIN');
       const {userId}=req.user;
       const {cid}=req.body;
       const {rowCount,rows:[conversationid]}=await client.query<{id:string}>(`select id from conversation where id=$1`,[cid]);
         if(!rowCount){
          return res.status(404).json({
            "message":" No Conversation  between you and partner"
          })
         }
        const {rows:[user]}=await client.query<{name:string}>(`select name from users where id=$1`,[userId]);

         const {rows}=await client.query<{id:string,senderid:string}>(`
          SELECT m.id, m.senderid
          FROM message m
          WHERE m.cid = $1
            AND m.senderid <> $2
            AND NOT EXISTS (
                SELECT 1
                FROM seen s
                WHERE s.mid = m.id
                  AND s.seenid = $2)
          `,[conversationid?.id,userId])

         await client.query(`
          INSERT INTO seen (mid, seenid)
          SELECT m.id, $2
          FROM message m
          WHERE m.cid = $1
            AND m.senderid <> $2
            AND NOT EXISTS (
                SELECT 1
                FROM seen s
                WHERE s.mid = m.id
                  AND s.seenid = $2
            )
          `,[conversationid?.id,userId]);
         await client.query('COMMIT');

          const groupMap=new Map<string,string[]>();


        for(const {id,senderid} of rows){
             groupMap.set(senderid,[...(groupMap.get(senderid)||[]),id]);
          }
            
          for(const [key,value] of groupMap.entries() ){
            const ws=onlineUsers.get(key);
            ws?.send(JSON.stringify({
              event:"seen",
              cid:conversationid,
              messageIds:value,
              seenBy:user?.name,
              userId,  
            }))
          }
         return res.status(200).json({
            "message":"Message Seen Successfully"
         })

      }
  catch(err:any){
        await  client.query('ROLLBACK')
         console.log(err)
     return res.status(400).json({
            "message":"Message Failed Successfully",
            error:err
         })

  }
  finally{
    client.release();
  }
}
