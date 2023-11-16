import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Error404 from "./pages/404";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
      <Route path="/profile/" element={<App view="profile" />} />
      <Route path="/followers/" element={<App view="followers" />} />
      <Route path="/groups/" element={<App view="groups" />} />
      <Route path="/group/" element={<App view="group" />} />
      <Route path="/*" element={<App view="feed" />} />
      <Route path="*" element={<Error404 />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
