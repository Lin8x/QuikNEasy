import protein from "../assets/protein.png";
import fat from "../assets/fat.png";
import carbs from "../assets/.png";
const Assets = () => {
    return ( 

        <div className="assets">
            <a href="protein.png" target="_blank">
          <img
            src={protein}
            style={{ height: "40px" , width: "auto"  }}
            className="logo"
            alt="QuikNEasyProtein"
          />
        </a>
         <a href="fat.png" target="_blank">
          <img
            src={fat}
            style={{ height: "40px" , width: "auto"  }}
            className="logo"
            alt="QuikNEasyFat"
          />
        </a>
         <a href="carbs.png" target="_blank">
          <img
            src={carbs}
            style={{ height: "40px" , width: "auto"  }}
            className="logo"
            alt="QuikNEasyCarbs"
          />
        </a>
        </div>

     );
}
 
export default Assets;