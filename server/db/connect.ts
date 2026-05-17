import { Pool} from "pg"

import dotenv from "dotenv"

dotenv.config();


const pool= new Pool({
    // connection String
    connectionString: process.env.DATABASE_URL
})

export const connectDB= async()=>{
    try{
   const res= await pool.query("select 1") ;
        console.log(res);
    }
    catch(err){
        pool.end();
      throw err;
    }
}



