import { connectPeers } from "./sockets";
import "./file";
import "./observers";
import "./eventListeners";

setTimeout(() => {
  connectPeers();
}, 2000);
