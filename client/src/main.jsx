import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import store from "./store/store";
import "./index.css";
import "leaflet/dist/leaflet.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
    <Toaster richColors />
  </Provider>
);
