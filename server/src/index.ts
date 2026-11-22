import express from 'express';
import { connectDB } from '../db/connect';
import { AuthRouter } from '../routes/AuthRoutes';
import cookieParser from 'cookie-parser'
import morgan from "morgan"
import {parseCookie} from "cookie"
import WebSocket,{WebSocketServer} from "ws"
import http from "http"
import cors from "cors"
import { ConversationRouter } from '../routes/ConversationRoutes';
import { MessageRouter } from '../routes/MessageRouter';
import { userRouter } from '../routes/UserRoutes';
import { onlineUsers } from './types/OnlineUsers';
import { verifyToken } from '../controllers/token';
import type { JwtPayload } from 'jsonwebtoken';
import { getConversationMembers } from '../controllers/ConversationController';
const app = express();
const server=http.createServer(app);
const wss=new WebSocketServer({
server
});

const AuthWebSocket=(ws:WebSocket,req:http.IncomingMessage):string|JwtPayload=>{
    const cookie=parseCookie(req.headers.cookie||"");
    const refreshToken=cookie.refreshToken;
    if(!refreshToken) { return "";}

    const decoded=verifyToken(refreshToken)

    return decoded;
}


wss.on('connection',(ws,req)=>{
    console.log("Connected")
    // Authenticating WebSocket 
const decoded= AuthWebSocket(ws,req)

  if(typeof decoded =="string"|| !decoded.userId || !decoded.sessionId){
        ws.close(1008,"Unauthozied no token");
        return;
    }

        const {userId}=decoded;
        let userSockets=onlineUsers.get(userId);
        if(!userSockets){
        userSockets=new Set<WebSocket>();
        onlineUsers.set(userId,userSockets)
        }
        userSockets.add(ws)
        ws.on('message',async(data)=>{

            try{

             const {cid,event}=JSON.parse(data.toString())
             const {members,avatar:[img]}= await getConversationMembers(cid,userId);
                const image=img.image
                console.log("Image is ", ) 
             for(const member of members){
               const userSockets=onlineUsers.get(member.uid);
               
               if(!userSockets) continue;

               for(let socket of userSockets){
                if(socket.readyState!==WebSocket.OPEN) continue;
                   socket.send(JSON.stringify({
                        event,
                        cid,
                        userId,
                        image
                    }))  
               }
             }

            }
            catch(error){
                    console.error("WebSocket event failed:", error);
            }
                

        })
        console.log("MySOckets:",userSockets.size);
        ws.on('close',()=>{
            console.log('closed')
            userSockets?.delete(ws);
            if(userSockets?.size===0){
                onlineUsers.delete(userId);
            }
   
        })
    
})


app.use(express.json());
app.use(cookieParser())
app.use(cors(
  {
    origin : process.env.CLIENT_URL||'http://localhost:3000',
    credentials:true
  }
))
app.use(morgan("dev"))
app.use("/api/auth",AuthRouter)
app.use("/api/users",userRouter);
app.use("/api/conversations",ConversationRouter)
app.use("/api/message",MessageRouter);
app.use("/",(req,res)=>{
    res.status(404).json({message:"Route not found"})
})
const start=async ()=>{
try{
    await connectDB()
    server.listen(4000,()=>{
        console.log('Server is running on port 4000');
    })
}
catch(err){
    console.error('Error connecting to database:', err);
    process.exit(1);
}
}

start()