import "./share.scss";
import Image from "../../assets/4.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/authContext";
import { useQueryClient } from "@tanstack/react-query";
import { sendRequest } from "../../axios";
import MusicPlayer from "../musicPlayer/musicPlayer";

const Share = () => {
  const [file, setFile] = useState(null);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [comunidadeId, setComunidadeId] = useState("");
  const [comunidades, setComunidades] = useState([]); // Estado para armazenar as opções de comunidades

  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  //para teste
  useEffect(() => {
    const fetchComunidades = async () => {
      try {
        const response = await sendRequest.get(
          `/communities/user/${currentUser?.id}`
        );
        setComunidades(response.data); // Define as comunidades recebidas do servidor
      } catch (error) {
        console.error("Erro ao buscar comunidades:", error);
      }
    };

    fetchComunidades();
  }, []);

  const uploadFile = async () => {
    if (!file) return "";
    console.log(file);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await sendRequest.post("/upload", formData);
      console.log(response);
      return response.data;
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Failed to upload file.");
      return "";
    }
  };

  const handleShareClick = async (e) => {
    e.preventDefault();
    setError("");
    let songUrl = await uploadFile();
    if (file && !songUrl) return;
    try {
      console.log(content);
      console.log(songUrl);
      const response = await sendRequest.post("/posts", {
        conteudo: content,
        link: songUrl,
        comunidade_id: comunidadeId,
      });
      console.log(response);
      // refetch posts
      queryClient.invalidateQueries(["posts"]);
      setContent("");
      setFile(null);
      setComunidadeId("");
    } catch (error) {
      console.error("Error oa criar post", error);
      setError("Falhou em criar post.");
    }
  };

  return (
    <div className="share">
      {error && <div className="error">{error}</div>}{" "}
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
            <select
              value={comunidadeId}
              onChange={(e) => setComunidadeId(e.target.value)}
            >
              <option value="">Selecionar Comunidade</option>
              {comunidades.map((comunidade) => (
                <option key={comunidade.id} value={comunidade.id}>
                  {comunidade.nome}
                </option>
              ))}
            </select>
            <button onClick={handleShareClick}>Share</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
