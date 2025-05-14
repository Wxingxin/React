import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import './index.css'
import App from "./App.jsx";
//sue react-redux
import { Provider } from "react-redux";
import store from "./store/noReactRedux/index.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* use react-redux */}
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
