import { useState } from "react";
import Navbar from "./components/Navbar";
import Homepage from "./components/Homepage";
import HomepageGraphics from "./components/HomepageGraphics";

function App() {
  const [] = useState(0);
  const title = "blah blah blah blah"; // lower text
  return (
    <>
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
            </div>
          </div>
          <h1>{title}</h1>
        </div>
      </div>
    </>
  );
}

export default App;
