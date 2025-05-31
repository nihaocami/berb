// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: "src/index.js", // only bundle this
      output: {
        entryFileNames: "berb.min.js", // output file name
        dir: "public", // output directory
      },
    },
    minify: process.env.NODE_ENV === "production" ? true : false, //"esbuild", // minify output (uses terser by default)
    outDir: "public",

    emptyOutDir: false, // prevent deleting other files in dist
  },
});
