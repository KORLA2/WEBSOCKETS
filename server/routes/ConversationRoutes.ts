
import Router from "express";
import { getConversationById ,getAllMyConversations,DeleteConversationById, createConversation, createDirectConversation} from "../controllers/ConversationController"
import { ProtectRoute } from "../middleware/ProtectRoute";
export const ConversationRouter=Router();
ConversationRouter.get("/getall",ProtectRoute,getAllMyConversations);
ConversationRouter.post("/creategroup",ProtectRoute,createConversation);
ConversationRouter.get("/:id",ProtectRoute,getConversationById);
ConversationRouter.post("/direct",ProtectRoute,createDirectConversation)
ConversationRouter.delete("/delete/:id",ProtectRoute,DeleteConversationById);

