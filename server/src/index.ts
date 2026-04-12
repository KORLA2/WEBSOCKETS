import http from "http";
import express from "express";
import { WebSocketServer } from "ws";

let app= express();
let server= app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});



let wss= new WebSocketServer({server});


