import "./share.scss";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useQueryClient } from "@tanstack/react-query";
import { sendRequest } from "../../axios";

const Share = () => {
  const [file, setFile] = useState(null);
  const [cont, setCont] = useState("");
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const resp = await sendRequest.post("/upload", formData);
      return resp.data; // (Assume que a URL da imagem está no campo 'data')
    } catch (err) {
      console.log(err);
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    let imgUrl = "";
    if (file) imgUrl = await upload();

    try {
      await sendRequest.post("/posts", {
        conteudo: cont,
        link: imgUrl,
      });

      // Invalidate and refetch posts
      queryClient.invalidateQueries(["posts"]);
      setCont("");
      setFile(null);
    } catch (error) {
      console.error("Erro ao criar post:", error);
    }
  };

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <div className="left">
            <img src={currentUser.profilePic} alt="" />
            <input
              type="text"
              placeholder={`O que você anda ouvindo, ${currentUser.name}?`}
              onChange={(e) => setCont(e.target.value)}
              value={cont}
            />
          </div>
          <div className="right">
            {file && (
              <img className="file" alt="" src="URL.createObjectURL(file)" />
            )}
          </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])} //parte de arquivos
            />
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="" />
                <span>Add Image</span>
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
            <button onClick={handleClick}>Share</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
