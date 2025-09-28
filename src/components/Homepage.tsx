import MakeMeal from "./MakeMeal";

const Homepage = () => {
  return (
    <div className="home">
      <h2
        style={{
          fontSize: "54px",
          fontWeight: "bold",
          color: "#252525",
          marginBottom: "0px",
          marginTop: "0px",
        }}
      >
        Quik-N-Easy
      </h2>
      <sub
        style={{
          fontSize: "24px",
          fontWeight: "light",
          color: "#252525",
          marginTop: "8px",
        }}
      >
        Blah blah blah
      </sub>
      <br />
      <MakeMeal />
    </div>
  );
};

export default Homepage;
