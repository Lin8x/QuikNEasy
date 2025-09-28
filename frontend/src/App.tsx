import { useState } from "react";
import Navbar from "./components/Navbar";
import Homepage from "./components/Homepage";
import HomepageGraphics from "./components/HomepageGraphics";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Planner from "./Planner";

function App() {
  const [] = useState(0);
  const title = "Meals done quick"; // lower text
  return (
    <>
      {/* <Router> */}
      <div className="App">
        <Navbar />
        <div className="Content">
          <div className="Row">
            {/* Left: Homepage content */}
            <div className="Left">
              <Homepage />
            </div>

            {/* Right: Graphics */}
            <div className="right">
              <HomepageGraphics />
              {/* <Routes>
                  <Route path="/" element={<App />} />
                  <Route path="/planner" element={<Planner />} />
                </Routes> */}
            </div>
          </div>
          <h1>{title}</h1>
        </div>
      </div>
      {/* </Router> */}
    </>
  );
}

export default App;
