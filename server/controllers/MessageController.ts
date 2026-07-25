import type { Request, Response } from "express";
import { pool } from "../db/connect";
export const CreateMessageController=async(req:Request,res:Response)=>{
  const client=await pool.connect();
 try{
    if(!req.user){
    return res.status(401).json({
        message:"Unauthorized You are not logged in"
    })
   }
    const{message,receiverId}=req.body;
    const {userId:senderId}=req.user;

    if(!message || !receiverId){
      return res.status(400).json({
        message:"message and receiverId are required"
      })
    }

    await client.query('BEGIN');
    const directKey=[senderId,receiverId].sort().join(":");
    const {rowCount,rows}=await client.query<{id:string}>(`select id from conversation where directkey=$1`,[directKey]);
    let  conversationId=rows[0]?.id
    if(!rowCount){
      const {rows}=await client.query<{id:string}>(
        'insert into conversation (directkey,lastmessageat) values($1,now()) returning id',
        [directKey]
      );
      conversationId=rows[0]?.id;

      await client.query(
        'insert into conversationmembers (uid,conversationId) values($1,$3),($2,$3) on conflict do nothing',
        [senderId,receiverId,conversationId]
      );
    }
 
    
    const {rows:[messageRows]}=await client.query(
      'insert into message (cid,body,senderId) values($1,$2,$3) returning *',
      [conversationId,message,senderId]
    );

    await client.query('update conversation set lastmessageat=now() , lastmessageid=$1 where id=$2',[messageRows.id,conversationId])

    await client.query('COMMIT');

    return res.status(201).json({
      conversationId,
      message:messageRows[0]
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
