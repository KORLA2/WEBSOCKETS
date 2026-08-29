import type { User } from "./User";

export type Conversation={
  conversationId: string,
  isGroup: boolean,
  name:string,
  createdAt: Date,
  lastMessage: Date
  directkey:string
}

export type Message={
id:string,
body:string,
image:string,
isMine:boolean,
senderId:string,
senderName:string,
createdat:Date,
isSeenByMe:boolean
}
export type ConversationListItem = {
  id:string,
  type:string,
  title:string,
  avatar:string,
  isGroup:boolean,
  members: (User&{
    isMe:boolean
  })[],
  lastMessage:Message,
  updatedat: Date,
};