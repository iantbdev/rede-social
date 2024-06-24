import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const createCommunity = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).send("Não está logado.");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).send("Token não é válido.");

    const q1 = "INSERT INTO comunidade (`nome`) VALUE (?)";
    const values = [req.body.nome];

    db.query(q1, [values], (err, result) => {
      if (err) return res.status(500).send(err);

      const comunidadeId = result.insertId;

      const q2 =
        "INSERT INTO usuario_participa_comunidade (`usuario_id`, `comunidade_id`) VALUES (?)";
      const values2 = [userInfo.id, comunidadeId];

      db.query(q2, [values2], (err, data) => {
        if (err) return res.status(500).send(err);
        return res.status(200).send("Comunidade criada com sucesso!");
      });
    });
  });
};

export const getUserCommunities = (req, res) => {
  const { userId } = req.params;

  const q = `SELECT c.* FROM comunidade c
    JOIN usuario_participa_comunidade upc ON c.id = upc.comunidade_id WHERE upc.usuario_id = ?`;

  db.query(q, [userId], (err, data) => {
    if (err) {
      console.error("Erro na consulta ao banco de dados:", err);
      return res.status(500).send(err);
    }
    console.log("Comunidades encontradas para o usuário:", data); // Log de depuração
    return res.status(200).send(data);
  });
};

export const addParticipant = (req, res) => {
  const { username, comunidadeId } = req.body;

  const q1 = "SELECT id FROM usuario WHERE username = ?";

  db.query(q1, [username], (err, data) => {
    if (err) {
      console.error("Erro na consulta ao banco de dados:", err);
      return res.status(500).send(err);
    }
    if (data.length === 0)
      return res.status(404).send("Usuário não encontrado.");

    const usuarioId = data[0].id;

    const q2 =
      "INSERT INTO usuario_participa_comunidade (`usuario_id`, `comunidade_id`) VALUES (?, ?)";
    const values = [usuarioId, comunidadeId];

    db.query(q2, values, (err, result) => {
      if (err) {
        console.error("Erro ao adicionar participante:", err);
        return res.status(500).send(err);
      }
      return res.status(200).send("Participante adicionado com sucesso!");
    });
  });
};
