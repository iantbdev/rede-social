import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { sendRequest } from "../../axios.js";
import moment from "moment";

const Comments = ({ id_postagem }) => {
  const [cont, setCont] = useState(""); //conteudo
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["comments", id_postagem],
    queryFn: () =>
      sendRequest.get(`/comments?id_postagem=${id_postagem}`).then((resp) => {
        return resp.data;
      }),
  });

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      await sendRequest.post("/comments", {
        conteudo: cont,
        postagem_id_postagem: id_postagem,
      });

      // refetch comentários
      queryClient.invalidateQueries(["comments", id_postagem]);
      setCont("");
    } catch (error) {
      console.error("Erro ao criar comentário:", error);
    }
  };

  return (
    <div className="comments">
      <div className="write">
        <img src={currentUser.profilePic} alt="" />
        <input
          type="text"
          placeholder="escreva um comentário"
          value={cont}
          onChange={(e) => setCont(e.target.value)}
        />
        <button onClick={handleClick}>Send</button>
      </div>
      {isLoading
        ? "loading"
        : data.map((usuario_comenta_postagem) => (
            <div className="comment">
              <img src={usuario_comenta_postagem.profilePic} alt="" />
              <div className="info">
                <span>{usuario_comenta_postagem.nome_completo}</span>
                <p>{usuario_comenta_postagem.conteudo}</p>
              </div>
              <span className="date">
                {" "}
                {moment(usuario_comenta_postagem.data).fromNow()}{" "}
              </span>
            </div>
          ))}
    </div>
  );
};

export default Comments;
