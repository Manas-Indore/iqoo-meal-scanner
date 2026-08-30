import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

window.onerror = function (message, source, lineno, colno, error) {
  document.body.innerHTML = `
    <div style="padding: 20px; background: red; color: white; font-family: monospace; white-space: pre-wrap;">
      <h2>Error caught:</h2>
      <p>${message}</p>
      <p>Source: ${source}</p>
      <p>Line: ${lineno}</p>
      <p>${error?.stack || ''}</p>
    </div>
  `;
};

window.onunhandledrejection = function (event) {
  document.body.innerHTML = `
    <div style="padding: 20px; background: orange; color: white; font-family: monospace; white-space: pre-wrap;">
      <h2>Unhandled Promise Rejection:</h2>
      <p>${event.reason}</p>
    </div>
  `;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").then(() => {
      console.log("Service worker registered");
    });
  });
}