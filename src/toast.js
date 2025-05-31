import Toastify from "toastify-js";

const toastStyle = {
  background: "white",
  borderRadius: "15px",
  color: "black",
};

/**
 * Display a toast message
 * @param {string} text
 */
export const showToast = (text) => {
  Toastify({
    text,
    duration: 3000,
    close: true,
    stopOnFocus: true,
    style: toastStyle,
  }).showToast();
};
