import {
  progressDetails,
  uploadButtons,
  progressBar,
  progressPercent,
  transferView,
  connectView,
  fileNameDisplay,
  fileModeBtn,
  textModeBtn,
  textView,
  uploadContainer,
} from "./elements";
import { showToast } from "./toast";

/**
 * copy any string to clipboard. Support for multiple browsers
 *
 * @param {string} value
 * @param {string} message
 * @returns void
 */
export const copyToClipboard = (value, message = "Copied to clipboard!") => {
  if (navigator.clipboard && window.isSecureContext) {
    // Modern method
    showToast(message);
    return navigator.clipboard.writeText(value).catch((err) => {
      console.error("Clipboard write failed:", err);
      showToast("Failed to copy");
    });
  } else {
    // Fallback for older browsers
    const textarea = document.createElement("textarea");
    textarea.value = value;

    // Avoid scrolling to bottom
    textarea.style.position = "fixed";
    textarea.style.top = "-1000px";
    textarea.style.left = "-1000px";

    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
      const success = document.execCommand("copy");
      showToast("Copied to clipboard");
      gtag("event", "copiedlink");
      if (!success) throw new Error("execCommand failed");
    } catch (err) {
      console.error("Fallback copy failed:", err);
      showToast("Failed to copy.");
    }

    document.body.removeChild(textarea);
    return Promise.resolve(); // mimic async behavior
  }
};

/**
 *
 * Get the progress percent on the file transfer
 *
 * @param {number} fileSize
 * @param {number} offset
 * @returns
 */
export const getProgress = (fileSize, offset) => {
  return (offset / fileSize) * 100;
};

/**
 * Toggle the upload view on/off
 */
export const toggleUploadBtns = () => {
  progressDetails.classList.toggle("hidden");
  uploadButtons.classList.toggle("hidden");
};

/**
 * Update the progress bar and percent in the nav bar
 * @param {float} progress
 */

export const updateProgressDisplays = (progress, fileName) => {
  const value = Math.round(progress);
  progressBar.value = value;
  if (fileName) {
    fileNameDisplay.innerHTML = shortenFileName(fileName, 10);
  }
  progressPercent.innerHTML = `${value}%`;
};

/**
 * Toggle the dashboard steps
 */
export const toggleSteps = () => {
  transferView.classList.toggle("hidden");
  connectView.classList.toggle("hidden");
};

/**
 * given a file name as a string, we can shorten it to a max length
 *
 * @param {string} filename
 * @param {number} maxLength
 * @returns
 */
export function shortenFileName(filename, maxLength = 10) {
  const dotIndex = filename.lastIndexOf(".");
  if (dotIndex === -1 || dotIndex === 0) {
    // No extension or hidden file
    return filename.length > maxLength
      ? filename.slice(0, maxLength - 1) + "…"
      : filename;
  }

  const name = filename.slice(0, dotIndex);
  const ext = filename.slice(dotIndex);

  // If the extension is too long to fit anything else
  if (ext.length >= maxLength - 1) {
    return "…" + ext.slice(-(maxLength - 1));
  }

  const namePart = name.slice(0, maxLength - ext.length - 1); // Reserve 1 char for ellipsis
  return name.length + ext.length > maxLength ? namePart + "…" + ext : filename;
}

/**
 * Sets the UI mode by toggling button styles and visibility of elements.
 *
 * @param {"fileMode" | "textMode"} mode - The current mode to switch to.
 * - `"fileMode"` shows the file upload UI.
 * - `"textMode"` shows the text input UI.
 */
export const toggleTransferMode = (mode) => {
  const isFile = mode === "fileMode";

  fileModeBtn.classList.toggle("btn-primary", isFile);
  fileModeBtn.classList.toggle("btn-secondary", !isFile);

  textModeBtn.classList.toggle("btn-primary", !isFile);
  textModeBtn.classList.toggle("btn-secondary", isFile);

  textView.classList.toggle("hidden", isFile); // Show in textMode
  uploadContainer.classList.toggle("hidden", !isFile); // Show in fileMode
};
