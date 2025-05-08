import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// 调试环境变量
console.log('Environment Variables Debug Info:');
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
if (import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.log('VITE_SUPABASE_ANON_KEY length:', import.meta.env.VITE_SUPABASE_ANON_KEY.length);
}

createRoot(document.getElementById("root")!).render(<App />);
