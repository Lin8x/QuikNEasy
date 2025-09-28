import React, { useState } from "react";
import "./Planner.css";
import Navbar from "./components/Navbar";
import NutritionLabel from "./components/NutritionLabel"; // You'll need to create this file

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
              min="0"
            />
          </div>

          <div className="stat-box protein-box">
            <h2>Protein 🍳</h2>
            <input
              type="number"
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
              placeholder="Enter grams of protein"
              min="0"
            />
          </div>

          <div className="stat-box fat-box">
            <h2>Fat 🥓</h2>
            <input
              type="number"
              value={fat}
              onChange={(e) => setFat(e.target.value)}
              placeholder="Enter grams of fat"
              min="0"
            />
          </div>

          <div className="stat-box carbs-box">
            <h2>Carbs 🍞</h2>
            <input
              type="number"
              value={carbs}
              onChange={(e) => setCarbs(e.target.value)}
              placeholder="Enter grams of carbs"
              min="0"
            />
          </div>
        </div>

        <div className="nutrition-label-container">
          <NutritionLabel
            calories={calories}
            protein={protein}
            fat={fat}
            carbs={carbs}
          />
        </div>
      </div>
    </div>
  );
};

export default Planner;
