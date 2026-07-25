import type {RequestHandler} from "express"
import { pool } from "../db/connect";
type Conversation={
    id:string,
    name: string,
    isgroup:boolean,
    createdat:Date,
    lastmessageat:Date
}

type Message={
    id:string,
    cid:string,
    senderid:string,
    body:string,
    createdat:Date,
    updatedat:Date

}

export const getConversationById:RequestHandler = async (req,res) => {
    const {id}=req.params;
try{

  if(!req.user){
     return res.status(400).json({
        "message":"You are not autohrized to access this page"
     })
  }

    const directKey=[req.user.userId,id].sort().join(":")
    const conversations= await pool.query<Conversation>('select id from conversation where directkey=$1',[directKey]);
    if(conversations.rowCount===0){
        console.log("Conversation not found");
        return res.status(200).json({
            message:"Conversation not found"
        })
    }
    console.log(conversations)
   const messages=await pool.query<Message>('select * from message where cid=$1 order by createdat desc limit 10',[conversations.rows[0]?.id])
   
    return res.status(200).json({
        conversation: conversations.rows[0],
        messages: messages.rows.sort((a,b)=>a.createdat.getTime()-b.createdat.getTime())
    });
}
catch(err){
    console.error(err);
    return res.status(500).json({
        message:"Internal server error"
    })
}
}


export const getAllMyConversations:RequestHandler=async(req,res)=>{
    
    try{
          if(!req.user){
        return res.status(401).json({
            message:"Unauthorized You are not logged in"
        })
    }
    
      const {userId}=req.user;
      const {rows}=await pool.query<Conversation>(
        `SELECT
            c.id AS conversationId,
            c.isgroup,
            u.id AS friendId,
            u.name as friendname,
            u.image as friendimage,
            m.body AS lastMessage,
            m.createdAt AS lastMessageAt
        FROM conversation c
        JOIN conversationmembers cm
            ON cm.conversationid = c.id
        AND cm.uid = $1
        JOIN conversationmembers friend
            ON friend.conversationid = c.id
        AND friend.uid <> $1
        JOIN users u
            ON u.id = friend.uid
        LEFT JOIN message m
            ON m.id = c.lastmessageid
        ORDER BY c.lastmessageat DESC;`,
        [userId]
      );
   console.log(rows)
        return res.status(200).json({
            myFriends:rows
        }
        )
    


   }
  catch(err){
     return res.status(401).json({
        message:"Cannot Feth All Conversations",
        error: err
    })
  }
}
