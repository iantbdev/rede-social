import "./share.scss";
import Image from "../../assets/music-64.svg";
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
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await sendRequest.post("/upload", formData);
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
      const response = await sendRequest.post("/posts", {
        conteudo: content,
        link: songUrl,
        comunidade_id: comunidadeId,
      });
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
            <img src={currentUser.profilePic  ||
                    "https://cdn-icons-png.flaticon.com/256/5987/5987811.png"
                  } alt="" />
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
