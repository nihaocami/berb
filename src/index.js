import "./file";
import "./observers";
import "./eventListeners";
import { connectPeers } from "./sockets";

setTimeout(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const peerID = urlParams.get("peer");

  if (peerID) {
    connectPeers(peerID);
  }
}, 2000);
