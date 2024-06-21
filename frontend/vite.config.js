import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import envCompatible from "vite-plugin-env-compatible"

/* // https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		port: 5001,
		proxy: {
			"/api": {
				target: "https://chatterbox-nine.vercel.app/",
			},
		},
	},
}); */

// https://vitejs.dev/config/
export default defineConfig({
  envPrefix: "REACT_APP_",
  plugins: [react(),

  envCompatible(),
  ],
})
