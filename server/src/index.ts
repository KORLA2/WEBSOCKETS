import express from 'express';

const app = express();
app.use(express.json());
const products=[
        {id:1,title:"Apple"},
        {id:2,title:"Mango"},
        {id:3,title:"Maagi"},
        {id:4,title:"Arizona"},
        {id:5,title:"Apple Juice"},
        {id:6,title:"Maa chan"},
        {id:7,title:"Arizopel"},
      ]

app.get("/api/products",(req,res)=>{
    const id:string = req.query.id as string;
    if(id){
         res.status(200).json(products.filter((p)=>p.title.includes(id)))
        return ;
    }
    res.status(200).json({products
    })
})

app.use((req,res)=>{
    res.status(404).json({message:"Not Found"})
})
app.listen(4000,()=>{
    console.log('Server is running on port 4000');
})
