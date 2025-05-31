import { fileInput } from "./elements";
import { dataChannel } from "./sockets";
import { showToast } from "./toast";
import { toggleUploadBtns } from "./util";

let fileSize = null;
let offset = null;
export const sendFile = () => {
  const file = fileInput.files[0];
  if (!file || !dataChannel || dataChannel.readyState !== "open") return;

  const chunkSize = 16384; // 16KB
  let offset = 0;

  const reader = new FileReader();
  const ONE_GB_IN_BYTES = 1 * 1024 * 1024 * 1024; // 1 GB = 1,073,741,824 bytes
  gtag("event", "fileselected");
  if (file.size > ONE_GB_IN_BYTES) {
    gtag("event", "largefile");
    showToast("Due to browser limits, we only allow 1GB or less per transfer.");
    return;
  }

  dataChannel.send(JSON.stringify({ type: "toggleUploadBtns" }));
  toggleUploadBtns();

  const readSlice = (o) => {
    const slice = file.slice(o, o + chunkSize);
    reader.readAsArrayBuffer(slice);
  };

  reader.onload = (e) => {
    const chunk = e.target.result;

    // Wait until buffer is low
    if (dataChannel.bufferedAmount > 1_000_000) {
      dataChannel.addEventListener("bufferedamountlow", function handler() {
        dataChannel.removeEventListener("bufferedamountlow", handler);
        reader.onload(e); // retry sending this chunk
      });
      return;
    }

    try {
      dataChannel.send(chunk);
      offset += chunk.byteLength;
      dataChannel.send(
        JSON.stringify({ type: "receiveProgress", fileSize: file.size, offset })
      );

      if (offset < file.size) {
        readSlice(offset);
      } else {
        dataChannel.send(JSON.stringify({ done: true, filename: file.name }));
      }
    } catch (err) {
      alert("Send error: " + err.message);
      gtag("event", "sendfailed", { message: err.message });
    }
  };

  readSlice(0);
};
