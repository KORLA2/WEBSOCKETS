import {Router} from "express"
import {GetAllUsers,UpdateUserProfile} from "../controllers/UserController"
import { ProtectRoute } from "../middleware/ProtectRoute";
import { upload } from "../middleware/Multer";
export const userRouter= Router();
userRouter.get("/allusers",ProtectRoute,GetAllUsers)
userRouter.patch("/update",ProtectRoute,upload.single("image"),UpdateUserProfile)