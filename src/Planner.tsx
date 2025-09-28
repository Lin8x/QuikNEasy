import React, { useState } from "react";
import "./Planner.css";
import Navbar from "./components/Navbar";

const Planner: React.FC = () => {
  const [calories, setCalories] = useState<string>("0");
  const [protein, setProtein] = useState<string>("0");
  const [fat, setFat] = useState<string>("0");
  const [carbs, setCarbs] = useState<string>("0");

  const toNumber = (value: string) => (value === "" ? 0 : Number(value));

  return (
    <div className="planner-container">
      <Navbar />

      <div className="planner-content">
        <div className="stat-column">
          <div className="stat-box calories-box">
            <h2>Calories 🍗</h2>
            <input
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              placeholder="Enter calories"
            />
          </div>

          <div className="stat-box protein-box">
            <h2>Protein 🍳</h2>
            <input
              type="number"
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
              placeholder="Enter grams of protein"
            />
          </div>

          <div className="stat-box fat-box">
            <h2>Fat 🥓</h2>
            <input
              type="number"
              value={fat}
              onChange={(e) => setFat(e.target.value)}
              placeholder="Enter grams of fat"
            />
          </div>

          <div className="stat-box carbs-box">
            <h2>Carbs 🍞</h2>
            <input
              type="number"
              value={carbs}
              onChange={(e) => setCarbs(e.target.value)}
              placeholder="Enter grams of carbs"
            />
          </div>
        </div>

        <div className="right-side-placeholder"></div>
      </div>
    </div>
  );
};

export default Planner;
