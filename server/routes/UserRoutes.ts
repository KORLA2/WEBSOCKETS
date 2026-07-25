import {Router} from "express"
import {GetAllUsers} from "../controllers/UserController"
import { ProtectRoute } from "../middleware/ProtectRoute";
export const userRouter= Router();
userRouter.get("/allusers",ProtectRoute,GetAllUsers)