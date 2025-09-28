import { useState } from "react";
import salad from "./assets/salad.png";
import Navbar from "./components/Navbar";
import Homepage from "./components/Homepage";
import MakeMeal from "./components/MakeMeal";
import HomepageGraphics from "./components/HomepageGraphics";

function App() {
  const [count, setCount] = useState(0);
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
              <MakeMeal />
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
