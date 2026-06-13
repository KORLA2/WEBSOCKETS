import path from "path"
import fs from "fs"
import {pool} from "./connect"

 function migrate(){
const dir=path.join(process.cwd(),"db","migrations");
const files=fs.readdirSync(dir).filter(file => file.endsWith('.sql')).sort();
files.forEach(file=>{
const f=path.join(dir,file);
const sql=fs.readFileSync(f,'utf8');
pool.query(sql).then(()=>
    console.log(`Successfully migrated ${file}`))
.catch(err=>console.log(err , `Error migrating ${file}`))
 

}
)
}

migrate();