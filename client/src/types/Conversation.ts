export type Conversation={
  conversationId: string,
  isGroup: boolean,
  name:string,
  createdAt: Date,
  lastMessage: Date
  directkey:string
}


export type ConversationListItem = {
    conversationid: string;
    friendid: string;
    friendname: string;
    friendimage: string | null;
    lastmessage: string | null;
    lastmessageat: string;
    seen: boolean;
};