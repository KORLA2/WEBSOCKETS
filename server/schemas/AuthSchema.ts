import z from "zod";
export const signInSchema=z.object({
  email:z.email("InValid Email Address"),
  password:z.string().min(6,"Password must be at least 6 characters long")
})
export const signUpSchema=z.object({
email:z.email("InValid Email Address"),
password:z.string().min(6,"Password must be at least 6 characters long"),
confirmPassword:z.string().min(6,"Password must be at least 6 characters long")
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
}).strict()



