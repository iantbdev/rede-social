import "./followers.scss";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/authContext";
import { sendRequest } from "../../axios";
import { Link } from "react-router-dom";

const RightBar = () => {
  const { currentUser } = useContext(AuthContext);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await sendRequest.get(
          `/users/suggestions/${currentUser.id}`
        );
        setSuggestions(response.data);
      } catch (error) {
        console.error("Erro ao buscar sugestões de usuários:", error);
      }
    };

    fetchSuggestions();
  }, [currentUser.id]);

  return (
    <div className="rightBar">
      <div className="container">
        <div className="item">
          <span>Followers</span>
          {suggestions.map((usuario) => (
            <div className="user">
              <div className="userInfo">
                <img
                  src={
                    usuario.profilePic ||
                    "https://cdn-icons-png.flaticon.com/256/5987/5987811.png"
                  }
                  alt=""
                />
                <span>{usuario.username}</span>
              </div>
              <div className="buttons">
                <Link
                  to={`/profile/${usuario.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <button>Check Profile</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightBar;
