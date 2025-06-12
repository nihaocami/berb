import { fileInput } from "./elements";
import { dataChannel } from "./sockets";
import { showToast } from "./toast";
import { toggleUploadBtns } from "./util";

const chunkSize = 16384; // 16KB
const ONE_GB_IN_BYTES = 1 * 1024 * 1024 * 1024; // 1 GB

export const sendFile = () => {
  const files = fileInput.files;
  if (
    !files ||
    files.length === 0 ||
    !dataChannel ||
    dataChannel.readyState !== "open"
  )
    return;

  let fileIndex = 0;

  const sendNextFile = () => {
    const file = files[fileIndex];
    if (!file) return;

    if (file.size > ONE_GB_IN_BYTES) {
      gtag("event", "largefile");
      showToast(`File "${file.name}" exceeds 1GB limit. Skipping.`);
      fileIndex++;
      sendNextFile(); // skip this file
      return;
    }

    gtag("event", "fileselected");
    dataChannel.send(JSON.stringify({ type: "toggleUploadBtns" }));
    toggleUploadBtns();

    let offset = 0;
    const reader = new FileReader();

    const readSlice = (o) => {
      const slice = file.slice(o, o + chunkSize);
      reader.readAsArrayBuffer(slice);
    };

    reader.onload = (e) => {
      const chunk = e.target.result;

      if (dataChannel.bufferedAmount > 1_000_000) {
        dataChannel.addEventListener("bufferedamountlow", function handler() {
          dataChannel.removeEventListener("bufferedamountlow", handler);
          reader.onload(e); // retry
        });
        return;
      }

      try {
        dataChannel.send(chunk);
        offset += chunk.byteLength;
        dataChannel.send(
          JSON.stringify({
            type: "receiveProgress",
            fileName: file.name,
            fileSize: file.size,
            offset,
          })
        );

        if (offset < file.size) {
          readSlice(offset);
        } else {
          dataChannel.send(JSON.stringify({ done: true, filename: file.name }));
          fileIndex++;
          sendNextFile(); // move to next file
        }
      } catch (err) {
        alert("Send error: " + err.message);
        gtag("event", "sendfailed", { message: err.message });
      }
    };

    readSlice(0);
  };

  sendNextFile();
};
