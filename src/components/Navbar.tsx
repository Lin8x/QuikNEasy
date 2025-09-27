import enq_logo from "../assets/enq_logo.png";
const Navbar = () => {
  return (
  <div>
    <a href="enq_logo.png" target="_blank">
          <img
            src={enq_logo}
            style={{ height: "40px" , width: "auto"  }}
            className="logo"
            alt="QuikNEasyLogo"
          />
        </a>
  <nav className="navbar p-20 items-center flex max-w-600 mx-auto my-0 border-b-1 border-b-[#f2f2f2]">
    
    <div className="links">
      <a href="/" className="text-2xl font-bold ml-16 p-6">QuikNEasy</a>
      <a href="/PlanYourMeal" className="text-2xl font-bold ml-16 p-6"></a>
      </div>

    </nav></div>);
};

export default Navbar;
