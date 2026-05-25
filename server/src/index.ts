import express from 'express';
import { connectDB } from '../db/connect';
import { AuthRouter } from '../routes/AuthRoutes';

const app = express();
app.use(express.json());
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