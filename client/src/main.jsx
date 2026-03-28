import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import Client from "./Client.jsx";
import ScrollToTop from "./components/layout/ScrollToTop.jsx";
import { initializeStorage } from "./api/mock/mockData.js";
import "./index.css";

// Initialize mock backend storage before React mounts
initializeStorage();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ScrollToTop />
        <Client />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
