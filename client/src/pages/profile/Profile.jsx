import "./profile.scss";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { sendRequest } from "../../axios";
import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

const Profile = () => {
  const location = useLocation();
  const usuarioId = parseInt(location.pathname.split("/")[2]);
  const queryClient = useQueryClient();

  const { currentUser } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery({
    queryKey: ["user", usuarioId],
    queryFn: () =>
      sendRequest.get("/users/find/" + usuarioId).then((resp) => {
        return resp.data;
      }),
  });

  const {
    isLoading: seguidoresIsLoading,
    error: seguidoresError,
    data: seguidoresData,
  } = useQuery({
    queryKey: ["usuario_segue_usuario", usuarioId],
    queryFn: () =>
      sendRequest
        .get("/usuario_segue_usuario?usuario_id_seguindo=" + usuarioId)
        .then((resp) => {
          return resp.data;
        }),
  });

  const handleFollow = async () => {
    const following = seguidoresData.includes(currentUser.id);

    try {
      if (following) {
        await sendRequest.delete(
          `/usuario_segue_usuario?usuarioId=${usuarioId}`
        );
      } else {
        await sendRequest.post("/usuario_segue_usuario", { usuarioId });
      }

      queryClient.invalidateQueries(["usuario_segue_usuario", usuarioId]);
    } catch (err) {
      console.error("Erro ao seguir/desseguir usuário:", err);
    }
  };

  return (
    <div className="profile">
      {isLoading ? (
        "loading..."
      ) : error ? (
        "Erro ao carregar dados do perfil."
      ) : (
        <>
          <div className="images">
            <img src={data.coverPic} alt="" className="cover" />
            <img
              src={
                data.profilePic ||
                "https://cdn-icons-png.flaticon.com/256/5987/5987811.png"
              }
              alt="profilePicture"
              className="profilePic"
            />
          </div>
          <div className="profileContainer">
            <div className="uInfo">
              <div className="left">
                <a href="http://instagram.com">
                  <InstagramIcon fontSize="large" />
                </a>
                <a href="http://twitter.com">
                  <TwitterIcon fontSize="large" />
                </a>
                <a href="http://pinterest.com">
                  <PinterestIcon fontSize="large" />
                </a>
              </div>
              <div className="center">
                <span>{data.nome_completo}</span>
                <div className="info">
                  <div className="item">
                    <LanguageIcon />
                    <span>spotify.com</span>
                  </div>
                </div>
                {seguidoresIsLoading ? (
                  "loading..."
                ) : seguidoresError ? (
                  "Erro ao carregar dados de seguidores."
                ) : usuarioId === currentUser.id ? (
                  <button>Update</button>
                ) : (
                  <button onClick={handleFollow}>
                    {seguidoresData.includes(currentUser.id)
                      ? "Following"
                      : "Follow"}
                  </button>
                )}
              </div>
              <div className="right">
                <EmailOutlinedIcon />
                <MoreVertIcon />
              </div>
            </div>
            <Posts />
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
