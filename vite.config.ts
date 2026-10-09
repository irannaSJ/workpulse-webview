import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],

  base: "/assets/hrms_customization/dynamic-ui/",

  server : {

    host : true,
    allowedHosts: ["test.site"],
    proxy : {
      "/api": {
        target : "http://test.site:8000",
        changeOrigin : true,
        secure : false
      }
    }
  },

  build: {
    outDir: "../hrms_customization/public/dynamic-ui",
    emptyOutDir: true,

    rollupOptions:{
      output : {
        entryFileNames: "assets/app.js",
        chunkFileNames : "assets/[name].js",

        assetFileNames: (assetInfo) => {
          if(assetInfo.name?.endsWith(".css")){
            return "assets/app.css";
          }
          return "assets/[name][extname]";
        }
      }
    }
  },
});
