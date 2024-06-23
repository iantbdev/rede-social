import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { sendRequest } from "../../axios.js";
import CreateCommunity from "../../components/createCommunity/createCommunity.jsx";
import { useState, useContext, useEffect } from "react";
import "./comunidade.scss";
import CommunityPost from "../../components/posts/communityPosts.jsx";
import { AuthContext } from "../../context/authContext";

const Comunidade = () => {
  const { currentUser } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery({
    queryKey: ["userCommunities", currentUser?.id],
    queryFn: () =>
      sendRequest
        .get(`/communities/user/${currentUser?.id}`)
        .then((resp) => resp.data),
    enabled: !!currentUser?.id,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Erro ao carregar comunidades</div>;

  return (
    <div className="comunidade">
      <h1>Comunidades</h1>
      <CreateCommunity />
      <div className="communityList">
        {data.map((comunidade) => (
          <CommunityItem key={comunidade.id} comunidade={comunidade} />
        ))}
      </div>
    </div>
  );
};

const CommunityItem = ({ comunidade }) => {
  const [username, setUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();

  const handleAddParticipant = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await sendRequest.post("/communities/add-participant", {
        username,
        comunidadeId: comunidade.id,
      });
      queryClient.invalidateQueries(["userCommunities"]);
      setUsername("");
    } catch (err) {
      console.error("Erro ao adicionar participante:", err);
      setError("Erro ao adicionar participante");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="communityItem">
      <h2>{comunidade.nome}</h2>
      <p>{comunidade.descricao}</p>
      <span>Número da comunidade: {comunidade.id}</span>
      <form onSubmit={handleAddParticipant}>
        <input
          type="text"
          placeholder="Nome de usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adicionando..." : "Adicionar Participante"}
        </button>
      </form>
      {/* Exibir posts */}
      <div className="posts">
        <CommunityPost comunidadeId={comunidade.id} />
      </div>
    </div>
  );
};

export default Comunidade;
