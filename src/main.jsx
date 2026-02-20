import { createRoot } from 'react-dom/client'
import App from './App'
import { SoundProvider } from "./SoundContext";
import "./index.css";


createRoot(document.getElementById('root')).render(
    <SoundProvider>
      <App />
    </SoundProvider>
);