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
import { sendRequest } from "../../axios";
import MusicPlayer from "../musicPlayer/musicPlayer";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [totalLikes, setTotalLikes] = useState(0);

  useEffect(() => {
    fetchLikedStatus();
    fetchLikeAmount();
  }, [post.id_postagem]);

  const fetchLikedStatus = async () => {
    try {
      const response = await sendRequest.get(
        `/likes/liked/${post.id_postagem}`
      );
      if (response.data.length > 0) {
        setLiked(response.data[0].like);
      }
    } catch (error) {
      console.error("Error fetching liked status:", error);
    }
  };

  const fetchLikeAmount = async () => {
    try {
      const response = await sendRequest.get(`/likes/${post.id_postagem}`);
      setTotalLikes(response.data[0].likes);
    } catch (error) {
      console.error("Error fetching likes:", error);
    }
  };

  const handleLikeClick = async (e) => {
    e.preventDefault();
    try {
      await sendRequest.post("/likes", {
        postagem_id: post.id_postagem,
        like: !liked,
      });
      setLiked(!liked);
      fetchLikeAmount();
    } catch (error) {
      console.error("Error adding like:", error);
    }
  };

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img
              src={
                post.profilePic ||
                "https://cdn-icons-png.flaticon.com/256/5987/5987811.png"
              }
              alt=""
            />
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
          {post.link && <MusicPlayer music_src={"./upload/" + post.link} />}
          {/* <img src={"./upload/" + post.link} alt="" /> */}
        </div>
        <div className="info">
          <div
            className="item"
            onClick={handleLikeClick}
            aria-label="Like"
            role="button"
            tabIndex="0"
          >
            {liked ? <FavoriteOutlinedIcon /> : <FavoriteBorderOutlinedIcon />}
            {totalLikes}
          </div>
          <div
            className="item"
            onClick={() => setCommentOpen(!commentOpen)}
            aria-label="Comments"
            role="button"
            tabIndex="0"
          >
            <TextsmsOutlinedIcon />
            Comments
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
