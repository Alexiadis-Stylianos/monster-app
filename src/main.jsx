import { createRoot } from 'react-dom/client'
import App from './App'
import { SoundProvider } from './context/SoundContext';
import ToastProvider from './context/ToastProvider';
import ToastContainer from "./ToastContainer";
import "./index.css";


createRoot(document.getElementById('root')).render(
  <ToastProvider>
    <ToastContainer />
    <SoundProvider>
      <App />
    </SoundProvider>
  </ToastProvider>
);