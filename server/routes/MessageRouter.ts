import Router from "express";
import {  CreateMessageController } from "../controllers/MessageController";
import {ProtectRoute} from "../middleware/ProtectRoute";
export const MessageRouter=Router();
MessageRouter.post("/send",ProtectRoute,CreateMessageController);