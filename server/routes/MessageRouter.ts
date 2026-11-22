import Router from "express";
import {  CreateMessageController ,DeleteMessageController,AddReactionController} from "../controllers/MessageController";
import {ProtectRoute} from "../middleware/ProtectRoute";
import { upload } from "../middleware/Multer";
export const MessageRouter=Router();
MessageRouter.post("/send",ProtectRoute,upload.single('image'),CreateMessageController);
MessageRouter.delete("/delete",ProtectRoute,DeleteMessageController);
MessageRouter.post("/addreaction",ProtectRoute,AddReactionController);
