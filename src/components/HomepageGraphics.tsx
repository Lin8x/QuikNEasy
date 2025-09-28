import salad from "../path/to/salad.png";

const HomepageGraphics = () => {
  return (
    <a href={salad} target="_blank">
      <img
        src={salad}
        style={{ height: "400px", width: "auto" }}
        className="logo"
        alt="QuikNEasySalad"
      />
    </a>
  );
};

export default HomepageGraphics;
