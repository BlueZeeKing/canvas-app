import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from "vite";
import { visualizer } from "rollup-plugin-visualizer";

export default ({ mode }) => {
  // Load app-level env vars to node-level env vars.
  process.env = { ...process.env, ...loadEnv(mode, process.cwd(), "") };

  return defineConfig({
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            react: ["react"],
          },
        },
      },
    },
    plugins: [react(), visualizer()],
  });
};