import { defineConfig } from "vite";

export default defineConfig({
    base: "./",
    build: {
        target: "esnext",
        minify: "terser",
        assetsInlineLimit: 0,
        terserOptions: {
            compress: {
                passes: 2,
                unsafe: true,
                unsafe_arrows: true,
                drop_console: true,
                drop_debugger: true,
            },
            mangle: {
                properties: false,
            },
        },
        rollupOptions: {
            output: {
                manualChunks: undefined,
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name?.endsWith('.png')) {
                        return 'assets/[name][extname]';
                    }
                    return 'assets/[name].[hash][extname]';
                },
                chunkFileNames: '[name].[hash].js',
                entryFileNames: '[name].[hash].js'
            }
        }
    }
});
