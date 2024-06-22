import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { Link } from "react-router-dom";
import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Comments from "../comments/Comments";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [totalLikes, setTotalLikes] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const fetchData = async () => {
      await fetchLikedStatus(token);
      await fetchTotalLikes(token);
    };

    fetchData();
  }, [post.id]);

  const fetchLikedStatus = async (token) => {
    try {
      const response = await axios.get(`/api/likes/liked/${post.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLiked(response.data.liked);
    } catch (error) {
      console.error('Failed to fetch liked status', error);
    }
  };

  const fetchTotalLikes = async (token) => {
    try {
      const response = await axios.get(`/api/likes/${post.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTotalLikes(response.data.likes);
    } catch (error) {
      console.error('Failed to fetch like amount', error);
    }
  };

  const handleLikeClick = async () => {
    const token = localStorage.getItem('accessToken');
    try {
      await axios.post(`/api/likes/${post.id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchLikedStatus(token);
      await fetchTotalLikes(token);
    } catch (error) {
      console.error('Failed to add like', error);
    }
  };

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
          <div className="item" onClick={handleLikeClick} aria-label="Like" role="button" tabIndex="0">
            {liked ? <FavoriteOutlinedIcon /> : <FavoriteBorderOutlinedIcon />}
            {totalLikes}
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)} aria-label="Comments" role="button" tabIndex="0">
            <TextsmsOutlinedIcon />
            12 Comments
          </div>
          <div className="item" aria-label="Share" role="button" tabIndex="0">
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