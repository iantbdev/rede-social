import "./share.scss";
import Image from "../../assets/4.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useQueryClient } from "@tanstack/react-query";
import { sendRequest } from "../../axios";
import MusicPlayer from "../musicPlayer/musicPlayer";

const Share = () => {
  const [file, setFile] = useState(null);
  const [content, setContent] = useState("");
  const [error, setError] = useState(""); // Added state for error handling
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const uploadFile = async () => {
    if (!file) return "";
    console.log(file); // Return empty string if no file to upload
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await sendRequest.post("/upload", formData);
      console.log(response);
      return response.data; // Assuming the URL of the song is in the 'data' field
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Failed to upload file."); // Update error state
      return ""; // Return an empty string to indicate failure
    }
  };

  const handleShareClick = async (e) => {
    e.preventDefault();
    setError(""); // Reset error state
    let songUrl = await uploadFile(); 
    if (file && !songUrl) return; // Stop execution if the upload failed
    try {
      console.log(content);
      console.log(songUrl);
     const response = await sendRequest.post("/posts", {
        conteudo: content,
        link: songUrl,
      });
      console.log(response)
      // Invalidate and refetch posts
      queryClient.invalidateQueries(["posts"]);
      setContent("");
      setFile(null);
    } catch (error) {
      console.error("Error creating post:", error);
      setError("Failed to create post."); // Update error state
    }
  };

  return (
    <div className="share">
      {error && <div className="error">{error}</div>} {/* Display error message if any */}
      <div className="container">
        <div className="top">
          <div className="left">
            <img src={currentUser.profilePic} alt="" />
            <input
              type="text"
              placeholder={`O que você anda ouvindo, ${currentUser.nome_completo}?`}
              onChange={(e) => setContent(e.target.value)}
              value={content}
            />
          </div>
          {file && (
            <MusicPlayer playlist_src={URL.createObjectURL(file)}></MusicPlayer>
          )}
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="" />
                <span>Add Music</span>
              </div>
            </label>
            <div className="item">
              <img src={Map} alt="" />
              <span>Add Place</span>
            </div>
            <div className="item">
              <img src={Friend} alt="" />
              <span>Tag Friends</span>
            </div>
          </div>
          <div className="right">
            <button onClick={handleShareClick}>Share</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;