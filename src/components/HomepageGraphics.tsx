import salad from "../assets/salad.png";

const HomepageGraphics = () => {
  return (
    <a href={salad} target="_blank">
      <img
        src={salad}
        style={{ height: "500px", width: "auto" }}
        className="logo"
        alt="QuikNEasySalad"
      />
    </a>
  );
};

export default HomepageGraphics;
