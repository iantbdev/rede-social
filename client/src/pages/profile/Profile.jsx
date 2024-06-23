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

const Profile = () => {
  //não funciona ainda
  const location = useLocation();
  const usuarioId = location.pathname.split("/")[2];

  const { isLoading, error, data } = useQuery({
    queryKey: ["usuario", usuarioId],
    queryFn: () =>
      sendRequest.get("/users/find/" + usuarioId).then((resp) => {
        return resp.data;
      }),
  });

  const handleFollow = () => {};

  console.log(data + "dados do perfil:");

  return (
    <div className="profile">
      <div className="images">
        <img src="" alt="" className="cover" />
        <img
          src="https://images.pexels.com/photos/14028501/pexels-photo-14028501.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load"
          alt=""
          className="profilePic"
        />
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          <div className="left">
            <a href="http://facebook.com">
              <InstagramIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <TwitterIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <PinterestIcon fontSize="large" />
            </a>
          </div>
          <div className="center">
            <span>Josefa</span>
            <div className="info">
              <div className="item">
                <LanguageIcon />
                <span>spotify.com</span>
              </div>
            </div>
            <button onClick={handleFollow}>follow</button>
          </div>
          <div className="right">
            <EmailOutlinedIcon />
            <MoreVertIcon />
          </div>
        </div>
        <Posts />
      </div>
    </div>
  );
};

export default Profile;
