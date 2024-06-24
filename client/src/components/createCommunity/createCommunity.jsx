import { useState } from "react";
import { sendRequest } from "../../axios.js";
import { useQueryClient } from "@tanstack/react-query";
import "./createCommunity.scss";

const CreateCommunity = () => {
  const [nome, setNome] = useState("");
  const queryClient = useQueryClient();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendRequest.post("/communities/create", { nome });
      queryClient.invalidateQueries("communities");
      setNome("");
    } catch (err) {
      console.error("Erro ao criar comunidade:", err);
    }
  };

  return (
    <div className="createCommunity">
      <h2>Criar Comunidade</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome da Comunidade"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <button type="submit">Criar</button>
      </form>
    </div>
  );
};

export default CreateCommunity;
