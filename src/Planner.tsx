import React, { useState } from "react";
import "./MealPlanner.css";
import Navbar from "./components/Navbar";

const Planner: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<"input" | "results">("input");
  const [nutritionTargets, setNutritionTargets] = useState({
    calories: "",
    protein: "",
    fat: "",
    carbs: "",
    fiber: "",
    sugar: "",
    sodium: "",
    cholesterol: "",
  });

  const generateMealItems = (targets: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  }) => {
    return [
      {
        name: "Grilled Chicken Breast",
        brand: "Perdue Farms",
        calories: Math.round(targets.calories * 0.54),
        protein: Math.round(targets.protein * 0.8),
        fat: Math.round(targets.fat * 0.63),
        carbs: 0,
      },
      {
        name: "Quinoa",
        brand: "Foundation",
        calories: Math.round(targets.calories * 0.31),
        protein: Math.round(targets.protein * 0.14),
        fat: Math.round(targets.fat * 0.16),
        carbs: Math.round(targets.carbs * 0.78),
      },
      {
        name: "Steamed Broccoli",
        brand: "Green Giant",
        calories: Math.round(targets.calories * 0.09),
        protein: Math.round(targets.protein * 0.07),
        fat: 0,
        carbs: Math.round(targets.carbs * 0.22),
      },
      {
        name: "Olive Oil",
        brand: "Bertolli",
        calories: Math.round(targets.calories * 0.07),
        protein: 0,
        fat: Math.round(targets.fat * 0.21),
        carbs: 0,
      },
    ];
  };

  const handleInputChange = (field: string, value: string) => {
    setNutritionTargets((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerate = () => {
    if (
      !nutritionTargets.calories ||
      !nutritionTargets.protein ||
      !nutritionTargets.fat ||
      !nutritionTargets.carbs
    ) {
      alert("Please fill in at least Calories, Protein, Fat, and Carbs");
      return;
    }
    setCurrentPage("results");
  };

  const mealItems =
    currentPage === "results"
      ? generateMealItems({
          calories: parseInt(nutritionTargets.calories) || 0,
          protein: parseInt(nutritionTargets.protein) || 0,
          fat: parseInt(nutritionTargets.fat) || 0,
          carbs: parseInt(nutritionTargets.carbs) || 0,
        })
      : [];

  const totals = mealItems.reduce(
    (acc, item) => ({
      calories: acc.calories + item.calories,
      protein: acc.protein + item.protein,
      fat: acc.fat + item.fat,
      carbs: acc.carbs + item.carbs,
    }),
    { calories: 0, protein: 0, fat: 0, carbs: 0 }
  );

  const nutritionFacts = {
    servingSize: "1 complete meal (385g)",
    servingsPerContainer: 1,
    calories: totals.calories,
    caloriesFromFat: totals.fat * 9,
    totalFat: totals.fat,
    saturatedFat: Math.round(totals.fat * 0.16),
    transFat: 0,
    cholesterol: parseInt(nutritionTargets.cholesterol) || 85,
    sodium: parseInt(nutritionTargets.sodium) || 420,
    totalCarbs: totals.carbs,
    dietaryFiber: parseInt(nutritionTargets.fiber) || 8,
    sugars: parseInt(nutritionTargets.sugar) || 6,
    protein: totals.protein,
    vitaminA: 30,
    vitaminC: 90,
    calcium: 12,
    iron: 15,
  };

  if (currentPage === "input") {
    return (
      <div>
        <Navbar />
        <div className="page gradientPurplePink">
          <div className="container narrow">
            <div className="header">
              <h1 className="title">Meal Generator</h1>
              <p className="subtitle">
                Set your nutrition targets to generate a balanced meal
              </p>
            </div>

            <div className="card">
              <h2 className="cardTitle">Nutrition Targets</h2>

              <div className="grid grid-2 gap">
                <div>
                  <label className="label">
                    Calories <span className="req">*</span>
                  </label>
                  <input
                    type="number"
                    value={nutritionTargets.calories}
                    onChange={(e) =>
                      handleInputChange("calories", e.target.value)
                    }
                    className="input"
                    placeholder="e.g. 520"
                  />
                </div>

                <div>
                  <label className="label">
                    Protein (g) <span className="req">*</span>
                  </label>
                  <input
                    type="number"
                    value={nutritionTargets.protein}
                    onChange={(e) =>
                      handleInputChange("protein", e.target.value)
                    }
                    className="input"
                    placeholder="e.g. 45"
                  />
                </div>

                <div>
                  <label className="label">
                    Fat (g) <span className="req">*</span>
                  </label>
                  <input
                    type="number"
                    value={nutritionTargets.fat}
                    onChange={(e) => handleInputChange("fat", e.target.value)}
                    className="input"
                    placeholder="e.g. 19"
                  />
                </div>

                <div>
                  <label className="label">
                    Carbs (g) <span className="req">*</span>
                  </label>
                  <input
                    type="number"
                    value={nutritionTargets.carbs}
                    onChange={(e) => handleInputChange("carbs", e.target.value)}
                    className="input"
                    placeholder="e.g. 36"
                  />
                </div>
              </div>

              <div className="divider" aria-hidden />

              <h3 className="sectionTitle">Additional Limits (Optional)</h3>
              <div className="grid grid-2 gap">
                <div>
                  <label className="label">Fiber (g)</label>
                  <input
                    type="number"
                    value={nutritionTargets.fiber}
                    onChange={(e) => handleInputChange("fiber", e.target.value)}
                    className="input"
                    placeholder="e.g. 8"
                  />
                </div>

                <div>
                  <label className="label">Sugar (g)</label>
                  <input
                    type="number"
                    value={nutritionTargets.sugar}
                    onChange={(e) => handleInputChange("sugar", e.target.value)}
                    className="input"
                    placeholder="e.g. 6"
                  />
                </div>

                <div>
                  <label className="label">Sodium (mg)</label>
                  <input
                    type="number"
                    value={nutritionTargets.sodium}
                    onChange={(e) =>
                      handleInputChange("sodium", e.target.value)
                    }
                    className="input"
                    placeholder="e.g. 420"
                  />
                </div>

                <div>
                  <label className="label">Cholesterol (mg)</label>
                  <input
                    type="number"
                    value={nutritionTargets.cholesterol}
                    onChange={(e) =>
                      handleInputChange("cholesterol", e.target.value)
                    }
                    className="input"
                    placeholder="e.g. 85"
                  />
                </div>
              </div>

              <div className="center mt">
                <button onClick={handleGenerate} className="btnPrimary">
                  Generate My Meal 🍽️
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="page gradientGreenBlue">
        <div className="container wide">
          <div className="header">
            <button onClick={() => setCurrentPage("input")} className="backBtn">
              ← Back to Settings
            </button>
            <h1 className="title">Your Generated Meal</h1>
            <p className="subtitle">
              Individual ingredients and combined nutrition
            </p>
          </div>

          <div className="grid grid-4 gap mb">
            {mealItems.map((item, i) => (
              <div className="card small" key={i}>
                <div className="textCenter mb-8">
                  <h3 className="itemTitle">{item.name}</h3>
                  <p className="itemBrand">{item.brand}</p>
                </div>

                <div className="kv">
                  <div className="row">
                    <span className="key textOrange">Calories</span>
                    <span className="val bold">{item.calories}</span>
                  </div>
                  <div className="row">
                    <span className="key textBlue">Protein</span>
                    <span className="val bold">{item.protein}g</span>
                  </div>
                  <div className="row">
                    <span className="key textYellow">Fat</span>
                    <span className="val bold">{item.fat}g</span>
                  </div>
                  <div className="row">
                    <span className="key textGreen">Carbs</span>
                    <span className="val bold">{item.carbs}g</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="card mb">
            <h2 className="cardTitle center">Total Meal Nutrition</h2>
            <div className="grid grid-4 gap">
              <div className="stat statOrange">
                <div className="statNumber">{totals.calories}</div>
                <div className="statLabel">Calories</div>
                <div className="statHint">
                  Target: {nutritionTargets.calories}
                </div>
              </div>
              <div className="stat statBlue">
                <div className="statNumber">{totals.protein}g</div>
                <div className="statLabel">Protein</div>
                <div className="statHint">
                  Target: {nutritionTargets.protein}g
                </div>
              </div>
              <div className="stat statYellow">
                <div className="statNumber">{totals.fat}g</div>
                <div className="statLabel">Fat</div>
                <div className="statHint">Target: {nutritionTargets.fat}g</div>
              </div>
              <div className="stat statGreen">
                <div className="statNumber">{totals.carbs}g</div>
                <div className="statLabel">Carbs</div>
                <div className="statHint">
                  Target: {nutritionTargets.carbs}g
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="cardTitle">Combined Nutrition Facts</h3>

            <div className="label">
              <div className="labelHeader">
                <div className="labelTitle">Nutrition Facts</div>
              </div>

              <div className="labelRule thick" />
              <div className="labelRow">
                <span className="bold">Serving Size</span>{" "}
                {nutritionFacts.servingSize}
              </div>
              <div className="labelRow">
                <span className="bold">Servings Per Container</span>{" "}
                {nutritionFacts.servingsPerContainer}
              </div>

              <div className="labelRule mid" />
              <div className="labelRow spaceBetween bold">
                Amount Per Serving
              </div>
              <div className="labelRow spaceBetween xlarge bold">
                <span>Calories</span>
                <span>{nutritionFacts.calories}</span>
              </div>
              <div className="labelRight small">
                Calories from Fat {nutritionFacts.caloriesFromFat}
              </div>

              <div className="labelRule" />
              <div className="labelRight bold small">% Daily Value*</div>

              <div className="labelBlock">
                <div className="spaceBetween">
                  <span>
                    <span className="bold">Total Fat</span>{" "}
                    {nutritionFacts.totalFat}g
                  </span>
                  <span className="bold">
                    {Math.round((nutritionFacts.totalFat / 65) * 100)}%
                  </span>
                </div>
                <div className="spaceBetween indent">
                  <span>Saturated Fat {nutritionFacts.saturatedFat}g</span>
                  <span className="bold">
                    {Math.round((nutritionFacts.saturatedFat / 20) * 100)}%
                  </span>
                </div>
                <div className="spaceBetween indent">
                  <span>
                    <em>Trans</em> Fat {nutritionFacts.transFat}g
                  </span>
                  <span />
                </div>
                <div className="spaceBetween">
                  <span>
                    <span className="bold">Cholesterol</span>{" "}
                    {nutritionFacts.cholesterol}mg
                  </span>
                  <span className="bold">
                    {Math.round((nutritionFacts.cholesterol / 300) * 100)}%
                  </span>
                </div>
                <div className="spaceBetween">
                  <span>
                    <span className="bold">Sodium</span> {nutritionFacts.sodium}
                    mg
                  </span>
                  <span className="bold">
                    {Math.round((nutritionFacts.sodium / 2300) * 100)}%
                  </span>
                </div>
                <div className="spaceBetween">
                  <span>
                    <span className="bold">Total Carbohydrate</span>{" "}
                    {nutritionFacts.totalCarbs}g
                  </span>
                  <span className="bold">
                    {Math.round((nutritionFacts.totalCarbs / 300) * 100)}%
                  </span>
                </div>
                <div className="spaceBetween indent">
                  <span>Dietary Fiber {nutritionFacts.dietaryFiber}g</span>
                  <span className="bold">
                    {Math.round((nutritionFacts.dietaryFiber / 25) * 100)}%
                  </span>
                </div>
                <div className="spaceBetween indent">
                  <span>Sugars {nutritionFacts.sugars}g</span>
                  <span />
                </div>
                <div className="spaceBetween">
                  <span>
                    <span className="bold">Protein</span>{" "}
                    {nutritionFacts.protein}g
                  </span>
                  <span />
                </div>
              </div>

              <div className="labelRule" />
              <div className="labelBlock small">
                <div className="spaceBetween">
                  <span>Vitamin A</span>
                  <span>{nutritionFacts.vitaminA}%</span>
                </div>
                <div className="spaceBetween">
                  <span>Vitamin C</span>
                  <span>{nutritionFacts.vitaminC}%</span>
                </div>
                <div className="spaceBetween">
                  <span>Calcium</span>
                  <span>{nutritionFacts.calcium}%</span>
                </div>
                <div className="spaceBetween">
                  <span>Iron</span>
                  <span>{nutritionFacts.iron}%</span>
                </div>
              </div>

              <div className="labelRule" />
              <div className="labelFoot small">
                * Percent Daily Values are based on a 2,000 calorie diet.
              </div>
            </div>
          </div>

          <div className="center muted mt">
            <p>Meal generated based on your nutrition targets</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Planner;
