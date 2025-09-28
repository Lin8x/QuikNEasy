import React from "react";

interface NutritionLabelProps {
  calories: string;
  protein: string;
  fat: string;
  carbs: string;
}

const NutritionLabel: React.FC<NutritionLabelProps> = ({
  calories,
  protein,
  fat,
  carbs,
}) => {
  const toNumber = (value: string) => (value === "" ? 0 : Number(value));

  // Calculate calories from macros (protein: 4 cal/g, carbs: 4 cal/g, fat: 9 cal/g)
  const calculatedCalories =
    toNumber(protein) * 4 + toNumber(carbs) * 4 + toNumber(fat) * 9;
  const displayCalories = toNumber(calories) || calculatedCalories;

  // Calculate daily value percentages (based on 2000 calorie diet)
  const fatDV = Math.round((toNumber(fat) / 65) * 100);
  const carbsDV = Math.round((toNumber(carbs) / 300) * 100);
  const proteinDV = Math.round((toNumber(protein) / 50) * 100);

  const labelStyle: React.CSSProperties = {
    width: "280px",
    fontFamily: "Arial, sans-serif",
    fontSize: "12px",
    backgroundColor: "white",
    border: "2px solid black",
    padding: "8px",
    color: "black",
    lineHeight: "1.2",
  };

  const headerStyle: React.CSSProperties = {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "2px",
    textAlign: "left",
  };

  const servingSizeStyle: React.CSSProperties = {
    fontSize: "14px",
    marginBottom: "8px",
    borderBottom: "8px solid black",
    paddingBottom: "4px",
  };

  const caloriesStyle: React.CSSProperties = {
    fontSize: "36px",
    fontWeight: "bold",
    marginBottom: "8px",
    borderBottom: "4px solid black",
    paddingBottom: "4px",
  };

  const dvHeaderStyle: React.CSSProperties = {
    fontSize: "12px",
    fontWeight: "bold",
    textAlign: "right",
    marginBottom: "4px",
    borderBottom: "1px solid black",
    paddingBottom: "2px",
  };

  const nutrientRowStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px solid #999",
    paddingTop: "2px",
    paddingBottom: "2px",
  };

  const boldNutrientStyle: React.CSSProperties = {
    ...nutrientRowStyle,
    fontWeight: "bold",
    borderBottom: "1px solid black",
  };

  const footerStyle: React.CSSProperties = {
    fontSize: "10px",
    marginTop: "8px",
    borderTop: "4px solid black",
    paddingTop: "4px",
    textAlign: "left",
  };

  return (
    <div style={labelStyle}>
      <div style={headerStyle}>Nutrition Facts</div>
      <div style={servingSizeStyle}>
        <div>
          Serving size <strong>1 serving</strong>
        </div>
      </div>

      <div style={caloriesStyle}>
        <div>
          Calories{" "}
          <span style={{ float: "right" }}>{Math.round(displayCalories)}</span>
        </div>
      </div>

      <div style={dvHeaderStyle}>% Daily Value*</div>

      <div style={boldNutrientStyle}>
        <span>
          <strong>Total Fat</strong> {toNumber(fat)}g
        </span>
        <span>
          <strong>{fatDV}%</strong>
        </span>
      </div>

      <div style={boldNutrientStyle}>
        <span>
          <strong>Total Carbohydrate</strong> {toNumber(carbs)}g
        </span>
        <span>
          <strong>{carbsDV}%</strong>
        </span>
      </div>

      <div style={boldNutrientStyle}>
        <span>
          <strong>Protein</strong> {toNumber(protein)}g
        </span>
        <span>
          <strong>{proteinDV}%</strong>
        </span>
      </div>

      <div style={footerStyle}>
        *The % Daily Value (DV) tells you how much a nutrient in a serving of
        food contributes to a daily diet. 2,000 calories a day is used for
        general nutrition advice.
      </div>
    </div>
  );
};

export default NutritionLabel;
