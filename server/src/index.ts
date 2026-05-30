import express from 'express';
import { connectDB } from '../db/connect';
import { AuthRouter } from '../routes/AuthRoutes';
import cookieParser from 'cookie-parser'
import morgan from "morgan"
import cors from "cors"
const app = express();
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


app.use("/",(req,res)=>{
    res.status(404).json({message:"Route not found"})
})
const start=async ()=>{
try{

    await connectDB()
    app.listen(4000,()=>{
        console.log('Server is running on port 4000');
    })
}
catch(err){
    console.error('Error connecting to database:', err);
    process.exit(1);
}
}

start()