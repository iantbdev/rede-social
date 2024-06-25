import "./leftBar.scss";
import Friends from "../../assets/1.png";
import Groups from "../../assets/2.png";
import { AuthContext } from "../../context/authContext";
import { useContext } from "react";
import { Link } from "react-router-dom";

const LeftBar = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="leftBar">
      <div className="container">
        <div className="menu">
          <div className="user">
            <img src={currentUser.profilePic || "https://cdn-icons-png.flaticon.com/256/5987/5987811.png" } alt="" />
            <Link
              to={`/profile/${currentUser.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <span>{currentUser.nome_completo}</span>
            </Link>
          </div>
          <div className="item">
            <img src={Friends} alt="" />
            <Link
              to="/followers"
              style={{ textDecoration: "none", color: "inherit" }}
            >
            <span>Friends</span>
            </Link>
          </div>
          <div className="item">
            <img src={Groups} alt="" />
            <Link
              to="/communities"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <span>Community</span>
            </Link>
          </div>
        </div>
        <hr />
      </div>
    </div>
  );
};

export default LeftBar;
