import React, { createContext, useContext } from "react";
type WebSocketRef={
    wsRef:React.RefObject<WebSocket | null>
}

const WebSocketContext=createContext<WebSocketRef|null>(null)

export const WebSocketContextProvider=WebSocketContext.Provider;
  export const useWebSocketContext=()=>{

     const context= useContext(WebSocketContext); 

     if(!context)   
       throw new Error(
      "useWebSocket must be used inside WebSocketProvider"
    )
  
    return context
  }