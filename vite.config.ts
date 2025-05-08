import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  // 检测环境变量
  const skipTsCheck = process.env.VITE_SKIP_TS_CHECK === 'true';
  console.log(`Type checking is ${skipTsCheck ? 'disabled' : 'enabled'}`);

  return {
    server: {
      host: "::",
      port: 8080,
    },
    build: {
      // 使用terser压缩代码
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
        },
      },
      // 生产环境不生成sourcemap
      sourcemap: mode !== 'production',
      // 提高chunk大小限制
      chunkSizeWarningLimit: 2000,
    },
    optimizeDeps: {
      // 预构建依赖
      force: skipTsCheck,
    },
    esbuild: {
      // 配置esbuild
      jsxFactory: 'React.createElement',
      jsxFragment: 'React.Fragment',
      target: ['es2020', 'safari14'],
    },
    plugins: [
      react(),
      mode === 'development' && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    }
  };
});
