import {
  minimizeButton,
  navProgressButton,
  fileInput,
  transferView,
  uploadContainer,
} from "./elements";
import { sendFile } from "./file";

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
