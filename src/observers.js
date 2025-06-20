// import {
//   loadingSpinner,
//   connectionHints,
//   connectionControls,
// } from "./elements";

// const observer = new MutationObserver((mutationsList) => {
//   for (const mutation of mutationsList) {
//     if (mutation.type === "childList") {
//       for (const node of mutation.addedNodes) {
//         if (node.nodeName === "CANVAS") {
//           setTimeout(() => {
//             loadingSpinner.classList.toggle("hidden");
//             connectionHints.classList.toggle("hidden");
//             connectionControls.classList.toggle("hidden");
//           }, 3000);
//         }
//       }
//     }
//   }
// });

// observer.observe(document.body, {
//   childList: true,
//   subtree: true,
// });
