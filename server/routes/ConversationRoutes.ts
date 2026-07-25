import Router from "express";
import { getConversationById ,getAllMyConversations  } from "../controllers/ConversationController"
import { ProtectRoute } from "../middleware/ProtectRoute";
export const ConversationRouter=Router();
ConversationRouter.get("/getall",ProtectRoute,getAllMyConversations);
ConversationRouter.get("/:id",ProtectRoute,getConversationById);

