import path from "path";
import { transformWithEsbuild } from "vite";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

const src = path.resolve(__dirname, "src");

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.{test,spec}.{js,jsx,ts,tsx}"],
  },
  plugins: [
    {
      name: "treat-js-files-as-jsx",
      enforce: "pre",
      async transform(code, id) {
        if (!/\/src\/.*\.js$/.test(id)) {
          return null;
        }
        return transformWithEsbuild(code, id, {
          loader: "jsx",
          jsx: "automatic",
        });
      },
    },
    react(),
  ],
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
    },
  },
  resolve: {
    alias: {
      "@games": path.resolve(src, "games"),
      "@services": path.resolve(src, "services"),

      // Preserve CRA-style absolute imports from `src`.
      AppFooter: path.resolve(src, "AppFooter.jsx"),
      GlobalStyles: path.resolve(src, "GlobalStyles.js"),
      Logos: path.resolve(src, "Logos.js"),
      ai: path.resolve(src, "ai"),
      components: path.resolve(src, "components"),
      "dev-utils": path.resolve(src, "dev-utils"),
      games: path.resolve(src, "games"),
      helpers: path.resolve(src, "helpers"),
      index: path.resolve(src, "index.js"),
      repositories: path.resolve(src, "repositories"),
      services: path.resolve(src, "services"),
      "window-with-props": path.resolve(src, "window-with-props.ts"),

      // Browser polyfills used by legacy dependencies.
      process: "process/browser",
      assert: "assert",
      crypto: "crypto-browserify",
      http: "stream-http",
      https: "https-browserify",
      os: "os-browserify/browser",
      stream: "stream-browserify",
      url: "url",
    },
  },
  define: {
    global: "globalThis",
  },
  server: {
    host: true,
  },
});
