import type {RequestHandler} from "express"
import { pool } from "../db/connect";
type LastMessage={
    conversationId:string,
    friendId:string,
    friendName: string,
    friendImage: string,
    senderId:string,
    isgroup:boolean,
    lastMessage:string,
    createdat:Date,
    lastMessageAt:Date,
    seen: boolean
}

type SenderMessage={
    id:string,
    senderid:string,
    body:string,
    name : string
    createdat:Date,
    updatedat:Date

}

type Group={
members:string[],
name:string 

}

export const createDirectConversation:RequestHandler=async(req,res)=>{
    const client=await pool.connect();
    try{  
console.log(req.user)

       if (!req.user) {
           return res.status(401).json({ message: "Unauthorized" });
         }
       const {receiverId}=req.body
   const {userId}=req.user;
    const directKey=[receiverId,userId].sort().join(":")
   await client.query("BEGIN");

    const {rowCount,rows:[cid]}= await client.query<{id:string}>(`select id from conversation where directkey=$1`,[directKey]);
     if(rowCount){
        return res.status(200).json({
            cid:cid?.id
        })
     } 
     const {rows:[conv]}=await client.query<{id:string}>(`insert into conversation (directkey) values($1) returning id`,[directKey]) 
       await client.query(`insert into conversationmembers (uid, conversationId) values($1,$2),($3,$2) on conflict do nothing`,[userId,conv?.id,receiverId]) 
       await client.query(`COMMIT`);
        return res.status(201).json({
            cid:conv?.id    
        })
    }
catch(err){
  await client.query('ROLLBACK');
  console.log(err)
  return res.status(500).json({
   "message":"Cannot create Conversation"
  })

}
finally{
    client.release();
}

}

export const createConversation:RequestHandler=async(req,res)=>{
  const client=await pool.connect();
    try{
    const{members,name}=req.body as Group;
    if(members.length<=2){
        return res.status(400).json({
            "message":"Create a Group for more than 2 people"
        })
    }

     await client.query('BEGIN')
   const {rows:[cid]}= await client.query<{id:string}>(`insert into conversation (isGroup,name) values($1,$2) returning id`,[true,name]);

   await Promise.all(members.map( memberId=>
     client.query(`insert into conversationmembers (uid,conversationId) values($1,$2)`,
        [memberId,cid?.id])));

        await client.query('COMMIT')
    return res.status(200).json({
        "message":"Group created successfully.."
    })

}
catch(err:any){
     await client.query('ROLLBACK')
     console.log(err)
return res.status(500).json({
    "message": "Cannot Create Conversation",
    error: err 
})
}
finally{
    client.release()
}
} 


export const getConversationById:RequestHandler = async (req,res) => {
    const {id}=req.params;
try{

  if(!req.user){
     return res.status(400).json({
        "message":"You are not autohrized to access this page"
     })
  }

    const {rowCount, rows:[member]}= await pool.query<{deletedat: Date | null}>(`
      select deletedat from conversationmembers where conversationid=$1 and
      uid=$2
      `,[id,req.user.userId])
    
      if(!rowCount){
        return res.status(403).json({
          message:"You are not authorized to access this conversation "
        })
      }

    const conversations= await pool.query<{id:string}>('select id from conversation where id=$1',[id]);
    if(conversations.rowCount===0){
        console.log("Conversation not found");
        return res.status(200).json({
            message:"Conversation not found"
        })
    }
    const messages=await pool.query<SenderMessage>(`
    SELECT
    m.id,
    sender.id as senderid,
    sender.name AS sendername,
    m.body,
    m.image,
    m.createdat,
    ARRAY_AGG(seenuser.name) AS seenby
    FROM message m
    JOIN conversationmembers me
    ON me.conversationid = m.cid
    AND me.uid = $2
    JOIN users sender
    ON sender.id = m.senderid

    LEFT JOIN seen s
    ON s.mid = m.id

    LEFT JOIN users seenuser
    ON seenuser.id = s.seenid
    WHERE m.cid = $1
    AND (
      $3::timestamp IS NULL
      OR m.createdat > $3::timestamp
    )
    GROUP BY
        m.id,
        sender.id,
        sender.name,
        m.body,
        m.image,
        m.createdat

    ORDER BY m.createdat desc
    limit 10`,[conversations.rows[0]?.id,req.user.userId,member?.deletedat])
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


 const { rows } = await pool.query(
  `
  SELECT
    c.id AS "id",

    CASE
      WHEN c.isgroup = true THEN 'group'
      ELSE 'direct'
    END AS "type",

    CASE
      WHEN c.isgroup = true THEN COALESCE(c.name, 'Unnamed group')
      ELSE COALESCE(other_user.name, 'Unknown user')
    END AS "title",

    CASE
      WHEN c.isgroup = true THEN NULL
      ELSE other_user.image
    END AS "avatar",

    COALESCE(member_data.members, '[]'::jsonb) AS "members",

    CASE
      WHEN last_message.id IS NULL THEN NULL
      ELSE jsonb_build_object(
        'id', last_message.id,
        'body', last_message.body,
        'senderId', last_message.senderid,
        'senderName', COALESCE(sender.name, 'Unknown user'),
        'createdAt', last_message.createdat,
        'isMine', last_message.senderid = $1,
        'isSeenByMe',
          CASE
            WHEN last_message.senderid = $1 THEN true
            WHEN EXISTS (
              SELECT 1
              FROM seen s
              WHERE s.mid = last_message.id
                AND s.seenid = $1
            ) THEN true
            ELSE false
          END
      )
    END AS "lastMessage",

    c.lastmessageat AS "updatedAt"

  FROM conversation c

  JOIN conversationmembers me
    ON me.conversationid = c.id
   AND me.uid = $1

  LEFT JOIN LATERAL (
    SELECT m.*
    FROM message m
    WHERE m.cid = c.id
      AND (
        me.deletedat IS NULL
        OR m.createdat > me.deletedat
      )
    ORDER BY m.createdat DESC
    LIMIT 1
  ) last_message ON true

  LEFT JOIN users sender
    ON sender.id = last_message.senderid

  LEFT JOIN LATERAL (
    SELECT u.id, u.name, u.image
    FROM conversationmembers cm
    JOIN users u
      ON u.id = cm.uid
    WHERE cm.conversationid = c.id
      AND cm.uid <> $1
    LIMIT 1
  ) other_user ON true

  LEFT JOIN LATERAL (
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', u.id,
      'name', u.name,
      'email', u.email,
      'image', u.image,
      'isMe', u.id = $1
    )
    ORDER BY
      CASE WHEN u.id = $1 THEN 0 ELSE 1 END,
      u.name
  ) AS members
  FROM conversationmembers cm
  JOIN users u
    ON u.id = cm.uid
  WHERE cm.conversationid = c.id
) member_data ON true

  ORDER BY c.lastmessageat DESC NULLS LAST, c.createdat DESC;
  `,
  [userId]
);
    console.log("This is my rows",rows)



        return res.status(200).json({
            myFriends:rows
        }
        )
   }
  catch(err){
    console.log(err)
     return res.status(401).json({
        message:"Cannot Feth All Conversations",
        error: err
    })
  }
}

export const DeleteConversationById:RequestHandler=async(req,res)=>{
    try{
        if(!req.user){
            return res.status(401).json({
                message:"You are not authorized to access this page"
            })
        }
        const{id}=req.params;
    const {rowCount}= await pool.query(`update conversationmembers set deletedAt=now() where conversationid =$1 and uid=$2`,[id,req.user.userId]);
       if(!rowCount){
          return res.status(404).json({
            message: "Conversation not found"
          })
       }
       return res.status(200).json({
          message: "Conversation Deleted Successfully" 
       })

    }
catch(err){
   return  res.status(500).json({
        message:"Internal Server Error",
        error:err
    })
}
}
