import { useState } from "react";
import salad from "./assets/salad.png";
import Navbar from "./components/Navbar";
import Homepage from "./components/Homepage";
import MakeMeal from "./components/MakeMeal";

function App() {
  const [count, setCount] = useState(0);
  const title = "blah blah blah blah"; // lower text
  return (
    <>
<div className="App">
  <Navbar />
  <div className="Content">
      <Homepage  />
      <div className="flex">
        <a href="salad.png" target="_blank">
          <img
            src={salad}
            style={{ height: "400px" , width: "auto"  }}
            className="logo"
            alt="QuikNEasySalad"
          />
        </a>
        {/* <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a> */}
      </div>
      <h1>{title}</h1>
        <MakeMeal/>
      </div>
      </div>
    </>
  );
}

export default App;
