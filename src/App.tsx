import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import enq_logo from "./assets/enq_logo.png";
import Navbar from "./components/Navbar";

function App() {
  const [count, setCount] = useState(0);
  const title = "QuikNEasy";
  return (
    <>
<div className="w-full min-h-screen flex flex-col">\
  f
      <div>
        <a href="enq_logo.png" target="_blank">
          <img
            src={enq_logo}
            width={200}
            style={{ height: "200px" }}
            className="logo"
            alt="QuikNEasyLogo"
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
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      </div>
    </>
  );
}

export default App;
