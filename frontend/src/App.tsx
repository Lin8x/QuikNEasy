import Navbar from "./components/Navbar";
import Homepage from "./components/Homepage";
import HomepageGraphics from "./components/HomepageGraphics";

export default function App() {
  const title = "Meals done quick";
  return (
    <div className="App">
      <Navbar />
      <div className="Content">
        <div className="Row">
          {/* Left: Homepage content */}
          <div className="Left">
            <Homepage />
          </div>

          {/* Right: Graphics */}
          <div className="Right">
            <HomepageGraphics />
          </div>
        </div>

        <h1>{title}</h1>
      </div>
    </div>
  );
}
