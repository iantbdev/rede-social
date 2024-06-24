import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const createCommunity = (req, res) => {
  console.log("Requisição para criar comunidade recebida."); // Log de depuração
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).send("Não está logado.");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).send("Token não é válido.");

    const q1 = "INSERT INTO comunidade (`nome`) VALUE (?)";
    const values = [req.body.nome];
    console.log("Valores:", values);

    db.query(q1, values, (err, data) => {
      if (err) return resp.status(500).send(err);

        const lastIdQuery = `SELECT LAST_INSERT_ID() as id;`;
        db.query(lastIdQuery, (err, selectResult) => {
          if (err) return resp.status(500).send(err);
          const comunidadeId = selectResult[0].id;

          const q2 =
            `INSERT INTO usuario_participa_comunidade (usuario_id, comunidade_id,eh_admin) VALUES (?);`;
          const values2 = [userInfo.id, comunidadeId, 1];

          db.query(q2, [values2], (err, data) => {
            if (err) return res.status(500).send(err);
            return res.status(200).send("Comunidade criada com sucesso!");
          });
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
    return res.status(200).send(data);
  });
};

export const getUserCount = (req, res) => {
  const { comunidadeId } = req.params; // Corrected line

  console.log(comunidadeId);

  const q = `SELECT count(u.id) as userCount FROM usuario u
        INNER JOIN usuario_participa_comunidade upc ON u.id = upc.usuario_id WHERE upc.comunidade_id = ?;`;

  db.query(q, [comunidadeId], (err, data) => {
    if (err) {
      console.error("Erro na consulta ao banco de dados:", err);
      return res.status(500).send(err);
    }
    return res.status(200).send(data[0]); // Ensure to send back the first element for direct access
  });
};

export const getCommunityUsers = (req, res) => {
  const { comunidadeId } = req.params;

  const q = `SELECT u.* FROM usuario u
INNER JOIN usuario_participa_comunidade upc ON u.id = upc.usuario_id WHERE upc.comunidade_id = ?;`;

  db.query(q, [comunidadeId], (err, data) => {
    if (err) {
      console.error("Erro na consulta ao banco de dados:", err);
      return res.status(500).send(err);
    }
    return res.status(200).send(data);
  });
};



export const addParticipant = (req, res) => {
  const { username, comunidadeId } = req.body;

  const q1 = `SELECT id FROM usuario WHERE username = ?`;

  db.query(q1, [username], (err, data) => {
    if (err) {
      console.error("Erro na consulta ao banco de dados:", err);
      return res.status(500).send(err);
    }
    if (data.length === 0)
      return res.status(404).send("Usuário não encontrado.");

    const usuarioId = data[0].id;

    const q2 =
      `INSERT INTO usuario_participa_comunidade (usuario_id, comunidade_id,eh_admin) VALUES (?, ?, ?);`;
    const values = [usuarioId, comunidadeId, 0];
    console.log("Valores:", values);
    db.query(q2, values, (err, result) => {
      if (err) {
        console.error("Erro ao adicionar participante:", err);
        return res.status(500).send(err);
      }
      return res.status(200).send("Participante adicionado com sucesso!");
    });
  });
};
