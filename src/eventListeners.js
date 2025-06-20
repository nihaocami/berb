import {
  minimizeButton,
  navProgressButton,
  fileInput,
  transferView,
  uploadContainer,
  startSessionBtn,
  initView,
  connectView,
  connectMagicWordBtn,
  magicWordInput,
} from "./elements";
import { sendFile } from "./file";
import { connectPeers } from "./sockets";

// minimize transfer window
minimizeButton.addEventListener("click", (e) => {
  transferView.classList.toggle("hidden");
  navProgressButton.classList.toggle("hidden");
});

// maximize transfer window
navProgressButton.addEventListener("click", (e) => {
  transferView.classList.toggle("hidden");
  navProgressButton.classList.toggle("hidden");
});

// send file when a file is selected
fileInput.addEventListener("change", () => {
  sendFile();
});

uploadContainer.addEventListener("click", () => {
  gtag("event", "fileclicked");
  fileInput.click();
});

startSessionBtn.addEventListener("click", () => {
  initView.classList.toggle("hidden");
  connectView.classList.toggle("hidden");
});

connectMagicWordBtn.addEventListener("click", () => {
  const magicWord = magicWordInput.value;
  if (magicWord) {
    initView.classList.toggle("hidden");
    connectPeers(magicWord.toUpperCase());
    connectView.classList.toggle("hidden");
  }
});
