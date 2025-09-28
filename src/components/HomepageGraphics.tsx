import salad from "../assets/salad.png";
// import protein from "../assets/protein.png";
// import fat from "../assets/fat.png";
// import carbs from "../assets/carbs.png";

const HomepageGraphics = () => {
  return (
    <div className="logo">
      <a href={salad} target="_blank">
        <img
          src={salad}
          style={{
            height: "400px",
            width: "fit-content",
            display: "block",
            margin: "0 auto",
          }}
          className="logo"
          alt="QuikNEasySalad"
        />
      </a>
      {/* <a href="protein.png" target="_blank">
        <img
          src={protein}
          style={{ height: "40px", width: "auto" }}
          className="logo"
          alt="QuikNEasyProtein"
        />
      </a>
      <a href="fat.png" target="_blank">
        <img
          src={fat}
          style={{ height: "40px", width: "auto" }}
          className="logo"
          alt="QuikNEasyFat"
        />
      </a>
      <a href="carbs.png" target="_blank">
        <img
          src={carbs}
          style={{ height: "40px", width: "auto" }}
          className="logo"
          alt="QuikNEasyCarbs"
        />
      </a> */}
    </div>
  );
};

export default HomepageGraphics;
