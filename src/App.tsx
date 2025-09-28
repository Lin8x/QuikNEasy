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
          <div className="flex items-center min-h-screen">
            {/* Left: Homepage content */}
            <div className="flex-1">
              <Homepage />
            </div>
            {/* Right: Graphics */}
            <div className="flex-1 flex justify-end">
              <HomepageGraphics />
            </div>
          </div>
          <h1>{title}</h1>
          <MakeMeal />
        </div>
      </div>
    </>
  );
}

export default App;
