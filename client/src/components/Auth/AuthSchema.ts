import z from "zod";
export const signInSchema=z.object({
    email:z.email("Invalid Email Address"),
    password:z.string().min(6,"Password must be at least 6 characters long")
}).strict() 
export const signUpSchema=z.object({
    email:z.email("Invalid Email Address"),
    password:z.string().min(6,"Password must be at least 6 characters long"),
    confirmPassword:z.string().min(6,"Password must be at least 6 characters long")
}).refine(data=>data.password==data.confirmPassword,{
    message:"Passwords don't match",
    path:["confirmPassword"]
}).strict()

export type SignInType=z.infer<typeof signInSchema>   
export type SignUpType=z.infer<typeof signUpSchema>


