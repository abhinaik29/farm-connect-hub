import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [

    tsConfigPaths(),

    // Tailwind v4's native Vite plugin — no tailwind.config.js needed
    tailwindcss(),

    // TanStack Start: SSR, routing, and the Nitro server build
    tanstackStart({
      server: {
        // points to your existing src/server.ts SSR error wrapper
        entry: "server",
      },
    }),

    // React fast refresh
    viteReact(),
  ],

  // avoids duplicate React copies in node_modules ("React/TanStack dedupe" in the old config)
  resolve: {
    dedupe: ["react", "react-dom", "@tanstack/react-router", "@tanstack/react-start"],
  },

  server: {
    port: Number(process.env.PORT) || 3000,
    host: true,
  },
});