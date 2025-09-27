import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import enq_logo from "./assets/enq_logo.png";
import protein from "./assets/protein.png";
import fat from "./assets/fat.png";
import carbs from "./assets/carbs.png";
import Navbar from "./components/Navbar";
import Home from "./components/Homepage";
import Homepage from "./components/Homepage";

function App() {
  const [count, setCount] = useState(0);
  const title = "QuikNEasy";
  return (
    <>
<div className="App">
  <Navbar />
  <div className="Content">
      <Homepage />
      <div>
        
        <a href="protein.png" target="_blank">
          <img
            src={protein}
            style={{ height: "80px" , width: "auto" }}
            className="logo"
            alt="QuikNEasyProtein"
          />
        </a>
        <a href="fat.png" target="_blank">
          <img
            src={fat}
            style={{ height: "80px" , width: "auto" }}
            className="logo"
            alt="QuikNEasyFat"
          />
        </a>
        <a href="carbs.png" target="_blank">
          <img
            src={carbs}
            style={{ height: "80px" , width: "auto" }}
            className="logo"
            alt="QuikNEasyCarbs"
          />
        </a>
        {/* <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a> */}
      </div>
      <h1>{title}</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          Plan your meal now!
        </button>
      </div>
      </div>
      </div>
    </>
  );
}

export default App;
