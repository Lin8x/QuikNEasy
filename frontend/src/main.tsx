import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import Planner from "./Planner.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <StrictMode>
      <Routes>
        <Route path="/*" element={<App />} />
        <Route path="/planner" element={<Planner />} />
      </Routes>
    </StrictMode>
  </BrowserRouter>
);
