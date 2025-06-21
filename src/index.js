import "./file";
import "./eventListeners";
import { connectPeers } from "./sockets";
import { loadingSpinner } from "./elements";

setTimeout(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const peerID = urlParams.get("peer");

  if (peerID) {
    connectPeers(peerID);
  }
  loadingSpinner.classList.toggle("hidden");
}, 2000);
