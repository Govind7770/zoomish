import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
// If your server can’t handle history API fallback, swap to HashRouter:
// import { HashRouter } from "react-router-dom";
import App from "./App";
import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    {/*
      If you still get 404s on refresh due to server config, replace BrowserRouter with:
      <HashRouter><App /></HashRouter>
    */}
  </React.StrictMode>
);
