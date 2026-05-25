

import {Pool} from 'pg';
import dotenv from "dotenv"
dotenv.config();

export const pool=new Pool({
    connectionString:process.env.DATABASE_URL,
   
})
export const connectDB=async()=>{
    try{
       await pool.query('SELECT 1')
        console.log('Database connected successfully');
    }
    catch(err){
        throw err;
    }
}
