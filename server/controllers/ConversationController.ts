import type {RequestHandler} from "express"
import { pool } from "../db/connect";
import { onlineUsers } from "../src/types/OnlineUsers";
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
     return res.status(401).json({
        "message":"You are not autohrized to access this page"
     })
  }
  const {userId}=req.user

   const {rowCount} = await pool.query(
      `
      SELECT 1
      FROM conversationmembers
      WHERE conversationid = $1
        AND uid = $2
      `,
      [id,userId]
    );

    if (rowCount === 0) {
      return res.status(403).json({
        message: "You are not authorized to access this page",
      });
    }

    const {rowCount:rc, rows:[member]}= await pool.query<{deletedat: Date | null}>(`
      select deletedat from conversationmembers where conversationid=$1 and
      uid=$2
      `,[id,req.user.userId])
    
      if(!rc){
        return res.status(403).json({
          message:"You are not authorized to access this conversation "
        })
      }

  const [messagesResult, readStatesResult] = await Promise.all([ pool.query(
        `
 WITH  mymessages AS( 
           SELECT
            m.id AS id,
            m.cid AS "conversationId",
            m.body,
            m.senderid AS "senderId",
            m.createdat AS "createdAt",
            m.image as "image"    ,
            u.name AS "senderName",
            u.image AS "senderAvatar",
           (m.senderid = $2) AS "isMine"

        FROM messages m

        JOIN users u
            ON u.id = m.senderid
              
        WHERE m.cid = $1
        AND NOT EXISTS (
            SELECT 1
            FROM deletedmessages dm
            WHERE dm.mid = m.id and dm.uid = $2
        )
        AND m.createdat> COALESCE($3, '1970-01-01'::timestamp)
            
       ),

    reactionsCount AS (
        select 
        r.mid,
        count(*) as count,
        BOOL_OR(r.uid=$2) as "reactedByMe",
        r.emoji 
        from reactions r
        join mymessages mm 
        on mm.id=r.mid
        group by r.mid,r.emoji
    ),

    myreactions AS(
       select rc.mid, jsonb_agg(
         jsonb_build_object(
            'emoji',rc.emoji,
            'count',rc.count,
            'reactedByMe',rc."reactedByMe"
         )
       ) as reactions
       from  reactionsCount rc
       group by rc.mid
  )

    select mm.*, COALESCE(mr.reactions, '[]'::jsonb) as reactions
    from mymessages mm
    left join myreactions mr on mr.mid=mm.id
     ORDER BY
     mm."createdAt", 
     mm.id 

    
        `,
        [id, userId,member?.deletedat]
      ),

       pool.query(
        `
        SELECT
            cm.uid AS "userId",
            u.name,
            u.image,
            cm.lastreadat AS "lastReadAt"

        FROM conversationmembers cm

        JOIN users u
            ON u.id = cm.uid

        WHERE cm.conversationid = $1
          AND cm.uid <> $2
        `,
        [id, userId]
       )    
    
    ])
    return res.status(200).json({
      messages: messagesResult.rows,
      readStates: readStatesResult.rows,
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
  `WITH my_conversations AS (
    SELECT
        cm.conversationid,
        cm.lastreadat,
        cm.deletedat
    FROM conversationmembers cm

    WHERE cm.uid = $1
),

conversation_members AS (
    SELECT
        cm.conversationid,

        jsonb_agg(
            jsonb_build_object(
                'id', u.id,
                'name', u.name,
                'image', u.image,
                'email', u.email
            )
            ORDER BY u.name
        ) AS members

    FROM conversationmembers cm

    JOIN users u
        ON u.id = cm.uid

    WHERE cm.uid <> $1

    GROUP BY cm.conversationid
),

latest_messages AS (
    SELECT DISTINCT ON (m.cid)
        m.cid,
        m.id,
        m.body,
        m.senderid,
        m.createdat,
        u.name AS sender_name

    FROM messages m
   
    JOIN users u
        ON u.id = m.senderid
    and not exists(
    select 1 from deletedmessages dm where dm.mid=m.id and dm.uid=$1 
    )

    ORDER BY
        m.cid,
        m.createdat DESC,
        m.id DESC
),

unread_counts AS (
    SELECT
        mc.conversationid,

        COUNT(m.id) AS unread_count

    FROM my_conversations mc

    JOIN messages m
        ON m.cid = mc.conversationid
       AND m.senderid <> $1
       AND (
            mc.lastreadat IS NULL
            OR m.createdat > mc.lastreadat
       )

    GROUP BY mc.conversationid
)

SELECT
    c.id AS id,
    c.isgroup,
    CASE
        WHEN c.isgroup = true
            THEN c.name
        ELSE
            cm.members -> 0 ->> 'name'
    END AS title,

    c.image as groupimage,
    cm.members,

    CASE
        WHEN lm.id IS NULL
            THEN NULL
        ELSE
            jsonb_build_object(
                'id', lm.id,
                'body', lm.body,
                'senderId', lm.senderid,
                'senderName', lm.sender_name,
                'createdAt', lm.createdat,
                'isMine', lm.senderid = $1
            )
    END AS "lastMessage",

    mc.lastreadat AS "lastReadAt",

    COALESCE(
        uc.unread_count,
        0
    ) AS "unreadCount",

    COALESCE(
        lm.createdat,
        c.createdat
    ) AS "updatedAt"

FROM my_conversations mc

JOIN conversation c
    ON c.id = mc.conversationid

LEFT JOIN conversation_members cm
    ON cm.conversationid = c.id

LEFT JOIN latest_messages lm
    ON lm.cid = c.id
    and lm.createdat> COALESCE(mc.deletedat,'1970-01-01'::timestamp)
LEFT JOIN unread_counts uc
    ON uc.conversationid = c.id

ORDER BY
    COALESCE(
        lm.createdat,
        c.createdat
    ) DESC;
  `,
  [userId]
);

        return res.status(200).json({
            myconversations:rows
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



export const ConversationSeen:RequestHandler=async(req,res)=>{
  
  try{
     if(!req?.user){
      return res.status(401).json({
          "message":"Not Authenticated"
      })
     }
     const {userId}=req.user;
     const {cid}=req.body;


     const {rowCount,rows:[user]}= await pool.query<{uid:string,lastreadat:Date}>(`update conversationmembers set lastreadat=now() where uid=$1 and conversationid=$2 returning uid , lastreadat`,[userId,cid])
     
      if (rowCount === 0) {
        return res.status(404).json({
          message: "Conversation not found"
        });
      }
  const {rows:members}=await pool.query<{uid:string}>(`select uid from conversationmembers where conversationid=$1`,[cid]);
        for(const member of members){
            const userSockets=onlineUsers.get(member.uid);
            if(!userSockets) return ;
               for(const socket of userSockets ){
                 socket?.send(JSON.stringify({
                    event:'seen',
                    cid,
                    readState:{
                    userId,
                    lastReadAt:user?.lastreadat
                }
                }))
               }
        }

     
     return res.status(204).json({
      cid,
      readState:{
        userId:user?.uid,
        lastReadAt:user?.lastreadat
      }
     })
  }
  catch(err){
      return res.status(500).json({
      "message": "Internal Server Error"
     })
    }

}


export const getConversationMembers=async(cid:string,userId:string)=>{
console.log(cid,userId)

  const [membersResult,imageResult]=await Promise.all([  pool.query<{uid:string}>(`
         select cm.uid from conversationmembers cm 
         join users u on cm.uid=u.id
         where cm.conversationid=$1 and cm.uid<>$2 and 
         exists( select 1 from conversationmembers me where me.conversationid=$1 and me.uid=$2 )
        
        `,[cid,userId]),
        pool.query(`
            select image from users where id=$1
            `,[userId])
    ])
        
return {
    members:membersResult.rows,
    avatar:imageResult.rows
};
 
}