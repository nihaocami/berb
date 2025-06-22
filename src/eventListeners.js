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
  fileModeBtn,
  textModeBtn,
  textView,
  textContent,
} from "./elements";
import { sendFile } from "./file";
import { connectPeers, dataChannel } from "./sockets";
import { toggleTransferMode } from "./util";

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

fileModeBtn.addEventListener("click", () => {
  if (fileModeBtn.classList.contains("btn-primary")) {
    return;
  }
  toggleTransferMode("fileMode");
  dataChannel.send(
    JSON.stringify({
      type: "fileMode",
    })
  );
});

textModeBtn.addEventListener("click", () => {
  if (textModeBtn.classList.contains("btn-primary")) {
    return;
  }
  toggleTransferMode("textMode");
  dataChannel.send(
    JSON.stringify({
      type: "textMode",
    })
  );
});

textContent.addEventListener("input", (e) => {
  const text = e.target.value;

  dataChannel.send(
    JSON.stringify({
      type: "textContent",
      data: text,
    })
  );
});
