import "./participants.scss";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { sendRequest } from "../../axios";
import { Link } from "react-router-dom";

const Participants = () => {
  const [participants, setParticipants] = useState([]);
  const { comunidadeId } = useParams();

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await sendRequest.get(`/communities/users/${comunidadeId}?limit=10`);
        setParticipants(response.data);
      } catch (error) {
        console.error("Erro ao buscar participantes da comunidade", error);
      }
    };

    fetchParticipants();
  }, [comunidadeId]);

  return (
    <div className="rightBar">
      <div className="container">
        <div className="item">
          <span>Participants</span>
          {participants.map((usuario) => (
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

export default Participants;
