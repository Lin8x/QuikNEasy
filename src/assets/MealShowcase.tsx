import React from "react";

const MealShowcase = () => {
  // Fake meal items/ingredients
  const mealItems = [
    {
      name: "Grilled Chicken Breast",
      brand: "Perdue Farms",
      calories: 280,
      protein: 35,
      fat: 12,
      carbs: 0,
    },
    {
      name: "Quinoa",
      brand: "Foundation",
      calories: 160,
      protein: 6,
      fat: 3,
      carbs: 28,
    },
    {
      name: "Steamed Broccoli",
      brand: "Green Giant",
      calories: 45,
      protein: 3,
      fat: 0,
      carbs: 8,
    },
    {
      name: "Olive Oil",
      brand: "Bertolli",
      calories: 35,
      protein: 0,
      fat: 4,
      carbs: 0,
    },
  ];

  // Calculate totals
  const totals = mealItems.reduce(
    (acc, item) => ({
      calories: acc.calories + item.calories,
      protein: acc.protein + item.protein,
      fat: acc.fat + item.fat,
      carbs: acc.carbs + item.carbs,
    }),
    { calories: 0, protein: 0, fat: 0, carbs: 0 }
  );

  // Fake detailed nutrition facts for the combined meal
  const nutritionFacts = {
    servingSize: "1 complete meal (385g)",
    servingsPerContainer: 1,
    calories: totals.calories,
    caloriesFromFat: totals.fat * 9,
    totalFat: totals.fat,
    saturatedFat: 3,
    transFat: 0,
    cholesterol: 85,
    sodium: 420,
    totalCarbs: totals.carbs,
    dietaryFiber: 8,
    sugars: 6,
    protein: totals.protein,
    vitaminA: 30,
    vitaminC: 90,
    calcium: 12,
    iron: 15,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Your Generated Meal
          </h1>
          <p className="text-gray-600">
            Individual ingredients and combined nutrition
          </p>
        </div>

        {/* Meal Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {mealItems.map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-4">
              <div className="text-center mb-3">
                <h3 className="font-bold text-gray-800 text-sm">{item.name}</h3>
                <p className="text-xs text-gray-600 italic">{item.brand}</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-orange-600">Calories</span>
                  <span className="font-semibold">{item.calories}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-blue-600">Protein</span>
                  <span className="font-semibold">{item.protein}g</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-yellow-600">Fat</span>
                  <span className="font-semibold">{item.fat}g</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-green-600">Carbs</span>
                  <span className="font-semibold">{item.carbs}g</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total Macros */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
            Total Meal Nutrition
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {totals.calories}
              </div>
              <div className="text-sm text-orange-700">Calories</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {totals.protein}g
              </div>
              <div className="text-sm text-blue-700">Protein</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {totals.fat}g
              </div>
              <div className="text-sm text-yellow-700">Fat</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {totals.carbs}g
              </div>
              <div className="text-sm text-green-700">Carbs</div>
            </div>
          </div>
        </div>

        {/* Nutrition Label */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Combined Nutrition Facts
          </h3>

          <div className="border-2 border-black p-4 font-mono text-sm bg-white max-w-md mx-auto">
            {/* Header */}
            <div className="text-center mb-2">
              <div className="text-2xl font-bold">Nutrition Facts</div>
            </div>

            <hr className="border-black border-t-8 mb-1" />

            {/* Serving info */}
            <div className="mb-1">
              <span className="font-bold">Serving Size</span>{" "}
              {nutritionFacts.servingSize}
            </div>
            <div className="mb-2">
              <span className="font-bold">Servings Per Container</span>{" "}
              {nutritionFacts.servingsPerContainer}
            </div>

            <hr className="border-black border-t-4 mb-1" />

            {/* Calories */}
            <div className="flex justify-between text-lg font-bold mb-1">
              <span>Amount Per Serving</span>
            </div>
            <div className="flex justify-between text-xl font-bold mb-2">
              <span>Calories</span>
              <span>{nutritionFacts.calories}</span>
            </div>
            <div className="text-right text-sm mb-2">
              Calories from Fat {nutritionFacts.caloriesFromFat}
            </div>

            <hr className="border-black border-t mb-1" />

            <div className="text-right font-bold text-sm mb-2">
              % Daily Value*
            </div>

            {/* Nutrients */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>
                  <span className="font-bold">Total Fat</span>{" "}
                  {nutritionFacts.totalFat}g
                </span>
                <span className="font-bold">29%</span>
              </div>
              <div className="flex justify-between pl-4">
                <span>Saturated Fat {nutritionFacts.saturatedFat}g</span>
                <span className="font-bold">15%</span>
              </div>
              <div className="flex justify-between pl-4">
                <span>
                  <span className="italic">Trans</span> Fat{" "}
                  {nutritionFacts.transFat}g
                </span>
                <span></span>
              </div>
              <div className="flex justify-between">
                <span>
                  <span className="font-bold">Cholesterol</span>{" "}
                  {nutritionFacts.cholesterol}mg
                </span>
                <span className="font-bold">28%</span>
              </div>
              <div className="flex justify-between">
                <span>
                  <span className="font-bold">Sodium</span>{" "}
                  {nutritionFacts.sodium}mg
                </span>
                <span className="font-bold">18%</span>
              </div>
              <div className="flex justify-between">
                <span>
                  <span className="font-bold">Total Carbohydrate</span>{" "}
                  {nutritionFacts.totalCarbs}g
                </span>
                <span className="font-bold">12%</span>
              </div>
              <div className="flex justify-between pl-4">
                <span>Dietary Fiber {nutritionFacts.dietaryFiber}g</span>
                <span className="font-bold">32%</span>
              </div>
              <div className="flex justify-between pl-4">
                <span>Sugars {nutritionFacts.sugars}g</span>
                <span></span>
              </div>
              <div className="flex justify-between">
                <span>
                  <span className="font-bold">Protein</span>{" "}
                  {nutritionFacts.protein}g
                </span>
                <span></span>
              </div>
            </div>

            <hr className="border-black border-t mb-2 mt-2" />

            {/* Vitamins */}
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Vitamin A</span>
                <span>{nutritionFacts.vitaminA}%</span>
              </div>
              <div className="flex justify-between">
                <span>Vitamin C</span>
                <span>{nutritionFacts.vitaminC}%</span>
              </div>
              <div className="flex justify-between">
                <span>Calcium</span>
                <span>{nutritionFacts.calcium}%</span>
              </div>
              <div className="flex justify-between">
                <span>Iron</span>
                <span>{nutritionFacts.iron}%</span>
              </div>
            </div>

            <hr className="border-black border-t mb-2 mt-2" />

            <div className="text-xs">
              <p>
                * Percent Daily Values are based on a 2,000 calorie diet. Your
                daily values may be higher or lower depending on your calorie
                needs:
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-500 text-sm">
          <p>This is a concept showcase with generated nutrition data</p>
        </div>
      </div>
    </div>
  );
};

export default MealShowcase;
