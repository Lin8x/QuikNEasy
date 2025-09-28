import enq_logo from "../assets/enq_logo.png";
const Navbar = () => {
  return (
  <div>
    
  <nav className="navbar">
    <a href="enq_logo.png" target="_blank">
          <img
            src={enq_logo}
            style={{ height: "40px" , width: "auto"  }}
            className="logo"
            alt="QuikNEasyLogo"
          />
        </a>

    </nav></div>);
};

export default Navbar;
