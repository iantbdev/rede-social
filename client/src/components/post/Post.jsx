import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [totalLikes, setLikes] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken'); 
    const fetchLikedStatus = async () => {
      try {
        const response = await axios.get(`/api/likes/getLiked?postId=${post.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setLiked(response.data.liked); 
      } catch (error) {
        console.error('Failed to fetch liked status', error);
      }
    };

    fetchLikedStatus();
  }, [post.id]); 

  useEffect(() => {
    const token = localStorage.getItem('accessToken'); 
    const fetchTotalLikes = async () => {
      try {
        const response = await axios.get(`/api/likes/getLikes?postId=${post.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setLikes(response.data.likes); 
      } catch (error) {
        console.error('Failed to fetch like amount', error);
      }
    };

    fetchTotalLikes();
  }, [post.id]);

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={post.profilePic} alt="" />
            <div className="details">
              <Link
                to={`/profile/${post.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.nome_completo}</span>
              </Link>
              <span className="date"> {moment(post.data).fromNow()} </span>
            </div>
          </div>
          <MoreHorizIcon />
        </div>
        <div className="content">
          <p>{post.conteudo}</p>
          <img src={"./upload/" + post.link} alt="" />
        </div>
        <div className="info">
          <div className="item">
            {liked ? <FavoriteOutlinedIcon /> : <FavoriteBorderOutlinedIcon />}
            {totalLikes}
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            12 Comments
          </div>
          <div className="item">
            <ShareOutlinedIcon />
            Share
          </div>
        </div>
        {commentOpen && <Comments id_postagem={post.id_postagem} />}
      </div>
    </div>
  );
};

export default Post;
