const MakeMeal = () => {
  const HandleClick = () => {
    console.log("hello jdjdj");
  };

  return (
    <button className="beginMeal" onClick={HandleClick}>
      Make a Meal Now!
    </button>
  );
};

export default MakeMeal;
