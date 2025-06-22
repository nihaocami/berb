import {
  qrCodeContainer,
  copyLinkButton,
  magicWordDisplay,
  initView,
  connectView,
  transferView,
  fileModeBtn,
  textModeBtn,
  textView,
  uploadContainer,
  textContent,
} from "./elements";
import {
  copyToClipboard,
  updateProgressDisplays,
  toggleSteps,
  toggleUploadBtns,
  getProgress,
  toggleTransferMode,
} from "./util";
const protocol = window.location.protocol;
const host = window.location.host;
let ws = new WebSocket(`${protocol === "https:" ? "wss" : "ws"}://${host}`);

let sendProgress = 0;
let receiveProgress = 0;

let receivedBuffers = [];

let peerConnection = null;
export let dataChannel = null;

ws.onmessage = async (msg) => {
  const data = JSON.parse(msg.data);
  if (data.type === "id") {
    const localId = data.id;
    const sessionLink = `${protocol}//${host}/?peer=${localId}`;
    magicWordDisplay.innerHTML = localId;
    new QRCode(qrCodeContainer, sessionLink);
    magicWordDisplay.addEventListener("click", () => {
      copyToClipboard(localId);
    });
  } else if (data.type === "offer") {
    await createAnswer(data.offer, data.from);
  } else if (data.type === "answer") {
    await peerConnection.setRemoteDescription(
      new RTCSessionDescription(data.answer)
    );
  } else if (data.type === "candidate") {
    if (peerConnection) {
      await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
    }
  }
};

/**
 * This function connects to a remote WebRTC peer if a "peer" ID is present in the URL
 *
 * @returns void
 */
export const connectPeers = async (peerID) => {
  if (!peerID) {
    return;
  }
  const remoteId = peerID;
  peerConnection = new RTCPeerConnection();

  dataChannel = peerConnection.createDataChannel("file");
  setupDataChannel(dataChannel);

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      sendToServer({
        to: remoteId,
        type: "candidate",
        candidate: event.candidate,
      });
    }
  };

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  sendToServer({ to: remoteId, type: "offer", offer });
};

async function createAnswer(offer, from) {
  peerConnection = new RTCPeerConnection();
  peerConnection.ondatachannel = (event) => {
    dataChannel = event.channel;
    setupDataChannel(dataChannel);
  };

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      sendToServer({ to: from, type: "candidate", candidate: event.candidate });
    }
  };

  await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  sendToServer({ to: from, type: "answer", answer });
}

function sendToServer(msg) {
  ws.send(JSON.stringify(msg));
}

/**
 * Handle all events within the channel between to WebRTC peers
 * @param {object} channel
 */
function setupDataChannel(channel) {
  channel.onopen = () => {
    initView.classList.add("hidden");
    connectView.classList.add("hidden");
    transferView.classList.remove("hidden");
  };

  channel.onmessage = (event) => {
    if (typeof event.data === "string") {
      const meta = JSON.parse(event.data);
      if (meta.type === "toggleUploadBtns") {
        toggleUploadBtns();
      }
      if (meta.type === "fileMode") {
        toggleTransferMode("fileMode");
      }
      if (meta.type === "textMode") {
        toggleTransferMode("textMode");
      }
      if (meta.type === "textContent") {
        textContent.value = meta.data;
      }
      if (meta.type == "receiveProgress") {
        fileSize = meta.fileSize;
        offset = meta.offset;

        const progress = getProgress(fileSize, offset);

        channel.send(
          JSON.stringify({
            type: "sendProgress",
            progress,
            fileName: meta.fileName,
          })
        );
        receiveProgress = progress;
        updateProgressDisplays(receiveProgress, meta.fileName);
      }

      if (meta.type == "sendProgress") {
        sendProgress = meta.progress;
        updateProgressDisplays(sendProgress, meta.fileName);
        if (sendProgress === 100) {
          toggleUploadBtns();
          gtag("event", "filesent");
        }
      }
      if (meta.done) {
        downloadAndReset(meta.filename);
      }
    } else {
      receivedBuffers.push(event.data);
    }
  };
}

/**
 * Create a blob from the downloaded buffers and save it for the user.
 *
 * Also reset the global vars to the initial values
 * @param {string} fileName
 */
const downloadAndReset = (fileName) => {
  const blob = new Blob(receivedBuffers);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName || "received_file";
  a.click();
  receivedBuffers = [];
  sendProgress = 0;
  receiveProgress = 0;
  toggleUploadBtns();
  gtag("event", "filereceived");
};
