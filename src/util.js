import {
  progressDetails,
  uploadButtons,
  progressBar,
  progressPercent,
  transferView,
  connectView,
  fileNameDisplay,
} from "./elements";
import { showToast } from "./toast";

/**
 * copy any string to clipboard. Support for multiple browsers
 *
 * @param {string} value
 * @returns void
 */
export const copyToClipboard = (value) => {
  if (navigator.clipboard && window.isSecureContext) {
    // Modern method
    showToast("Copied link to clipboard!");
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
  fileNameDisplay.innerHTML = fileName;
  progressPercent.innerHTML = `${value}%`;
};

/**
 * Toggle the dashboard steps
 */
export const toggleSteps = () => {
  transferView.classList.toggle("hidden");
  connectView.classList.toggle("hidden");
};
