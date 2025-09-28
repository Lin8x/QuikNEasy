import { useNavigate } from "react-router-dom";

const MakeMeal = () => {
  const navigate = useNavigate();

  const HandleClick = () => {
    navigate("/planner"); // 👈 send user to Planner page
  };

  return (
    <button className="beginMeal" onClick={HandleClick}>
      Make a Meal Now!
    </button>
  );
};

export default MakeMeal;
