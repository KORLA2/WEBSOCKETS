import { createContext, useContext } from "react";
import type { ConversationListItem } from "../../types/Conversation";

type CurrentConversationContextValue = {
  currentConversation?: ConversationListItem;
};

const CurrentConversationContext =
  createContext<CurrentConversationContextValue>({});

export const CurrentConversationProvider = CurrentConversationContext.Provider;

export const useCurrentConversation = () => useContext(CurrentConversationContext);
