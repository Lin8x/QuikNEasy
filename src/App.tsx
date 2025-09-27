import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import enq_logo from "./assets/enq_logo.png";
import Navbar from "./components/Navbar";
import Home from "./components/Homepage";
import Homepage from "./components/Homepage";

function App() {
  const [count, setCount] = useState(0);
  const title = "blah blah blah blah"; // lower text
  return (
    <>
<div className="App">
  <Navbar />
  <div className="Content">
      <Homepage />
      <div>
        
        {/* <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a> */}
      </div>
      <h1>{title}</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          Make a Meal Now!
        </button>
      </div>
      </div>
      </div>
    </>
  );
}

export default App;
