import "./rightBar.scss";
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
        const response = await sendRequest.get(`/users/suggestions/${currentUser.id}?limit=3`);
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
          <span>Suggestions For You</span>
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
        <div className="item">
          <span>Creators' Suggestions</span>
          <div className="user">
            <div>
              <iframe
                width="100%"
                height="300"
                scrolling="no"
                frameBorder="no"
                allow="autoplay"
                src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/496641684&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"
                title="SoundCloud Player"
              ></iframe>
              <div
                style={{
                  fontSize: "10px",
                  color: "#cccccc",
                  lineBreak: "anywhere",
                  wordBreak: "normal",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  fontFamily:
                    "Interstate, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Garuda, Verdana, Tahoma, sans-serif",
                  fontWeight: 100,
                }}
              >
                <a
                  href="https://soundcloud.com/user-272592510"
                  title="Video Game OSTs"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#cccccc", textDecoration: "none" }}
                >
                  Video Game OSTs
                </a>{" "}
                ·{" "}
                <a
                  href="https://soundcloud.com/user-272592510/mario-kart-wii-rainbow-road"
                  title="Mario Kart Wii - Rainbow Road"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#cccccc", textDecoration: "none" }}
                >
                  Mario Kart Wii - Rainbow Road
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="item">
          <span>Online Friends</span>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://cdn-icons-png.flaticon.com/256/5987/5987811.png"
                alt=""
              />
              <div className="online" />
              <span>Theodore</span>
            </div>
          </div>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://cdn-icons-png.flaticon.com/256/5987/5987811.png"
                alt=""
              />
              <div className="online" />
              <span>Simon</span>
            </div>
          </div>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://cdn-icons-png.flaticon.com/256/5987/5987811.png"
                alt=""
              />
              <div className="online" />
              <span>Alvin</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightBar;
