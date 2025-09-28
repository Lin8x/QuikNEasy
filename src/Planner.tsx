import React, { useState } from "react";
import "./Planner.css";
import Navbar from "./components/Navbar";

const Planner: React.FC = () => {
  const [calories, setCalories] = useState<number>(0);
  const [protein, setProtein] = useState<number>(0);
  const [fat, setFat] = useState<number>(0);
  const [carbs, setCarbs] = useState<number>(0);

  return (
    <div className="planner-container">
      {/* Navbar placeholder */}
      <Navbar />

      <div className="planner-content">
        {/* Left column: stat inputs */}
        <div className="stat-column">
          <div className="stat-box calories-box">
            <h2>Calories 🍗</h2>
            <input
              type="number"
              value={calories}
              onChange={(e) => setCalories(Number(e.target.value))}
              placeholder="Enter calories"
            />
          </div>

          <div className="stat-box protein-box">
            <h2>Protein 🍳</h2>
            <input
              type="number"
              value={protein}
              onChange={(e) => setProtein(Number(e.target.value))}
              placeholder="Enter grams of protein"
            />
          </div>

          <div className="stat-box fat-box">
            <h2>Fat 🥓</h2>
            <input
              type="number"
              value={fat}
              onChange={(e) => setFat(Number(e.target.value))}
              placeholder="Enter grams of fat"
            />
          </div>

          <div className="stat-box carbs-box">
            <h2>Carbs 🍞</h2>
            <input
              type="number"
              value={carbs}
              onChange={(e) => setCarbs(Number(e.target.value))}
              placeholder="Enter grams of carbs"
            />
          </div>
        </div>

        {/* Right column: leave empty for now */}
        <div className="right-side-placeholder">
          {/* We'll add your unique element here later */}
        </div>
      </div>
    </div>
  );
};

export default Planner;
